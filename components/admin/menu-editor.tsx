"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase";
import { fallbackMenuSections, parseMenuContentDocument, type MenuItem, type MenuSection } from "@/lib/menu-content";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function cloneSections(sections: MenuSection[]) {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, tags: [...item.tags] })),
  }));
}

function createEmptyItem(): MenuItem {
  return {
    name: "",
    description: "",
    price: "",
    tags: [],
    image: "",
  };
}

function createEmptySection(): MenuSection {
  return {
    name: "",
    note: "",
    items: [createEmptyItem()],
  };
}

function moveInArray<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function validateSections(sections: MenuSection[]) {
  for (const section of sections) {
    if (!section.name.trim()) {
      return "Section name is required.";
    }

    for (const item of section.items) {
      if (!item.name.trim()) {
        return "Item name is required.";
      }

      if (!item.price.trim()) {
        return "Item price is required.";
      }

      if (!item.image.trim()) {
        return "Each item needs an image.";
      }
    }
  }

  return "";
}

function getStatusCopy(status: SaveStatus) {
  switch (status) {
    case "saving":
      return "Saving changes to the live site...";
    case "saved":
      return "Saved. The live site now uses this menu.";
    case "error":
      return "Save failed. Review the message and try again.";
    default:
      return "Changes stay local until you press Save.";
  }
}

export function AdminMenuEditor() {
  const [sections, setSections] = useState<MenuSection[]>(() => cloneSections(fallbackMenuSections));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!firebaseDb) {
        setErrorMessage("Firebase database is not configured.");
        return;
      }

      try {
        const snapshot = await getDoc(doc(firebaseDb, "site-content", "menu"));

        if (!snapshot.exists()) {
          setSections(cloneSections(fallbackMenuSections));
          return;
        }

        const parsed = parseMenuContentDocument(snapshot.data());

        if (parsed) {
          setSections(cloneSections(parsed.sections));
        }
      } catch (nextError) {
        setStatus("error");
        setErrorMessage(nextError instanceof Error ? nextError.message : "Unable to load menu content.");
      }
    }

    void load();
  }, []);

  function updateSection(sectionIndex: number, updater: (section: MenuSection) => MenuSection) {
    setSections((current) =>
      current.map((section, currentIndex) => (currentIndex === sectionIndex ? updater(section) : section)),
    );
    setStatus("idle");
    setErrorMessage("");
  }

  function updateSectionField(sectionIndex: number, field: "name" | "note", value: string) {
    updateSection(sectionIndex, (section) => ({ ...section, [field]: value }));
  }

  function updateItemField(
    sectionIndex: number,
    itemIndex: number,
    field: "name" | "description" | "price" | "image",
    value: string,
  ) {
    updateSection(sectionIndex, (section) => ({
      ...section,
      items: section.items.map((item, currentItemIndex) =>
        currentItemIndex === itemIndex ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateItemTags(sectionIndex: number, itemIndex: number, value: string) {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateSection(sectionIndex, (section) => ({
      ...section,
      items: section.items.map((item, currentItemIndex) =>
        currentItemIndex === itemIndex ? { ...item, tags } : item,
      ),
    }));
  }

  function addSection() {
    setSections((current) => [...current, createEmptySection()]);
    setStatus("idle");
    setErrorMessage("");
  }

  function deleteSection(sectionIndex: number) {
    setSections((current) => current.filter((_, currentIndex) => currentIndex !== sectionIndex));
    setStatus("idle");
    setErrorMessage("");
  }

  function moveSection(sectionIndex: number, direction: -1 | 1) {
    setSections((current) => {
      const targetIndex = sectionIndex + direction;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      return moveInArray(current, sectionIndex, targetIndex);
    });
    setStatus("idle");
    setErrorMessage("");
  }

  function addItem(sectionIndex: number) {
    updateSection(sectionIndex, (section) => ({
      ...section,
      items: [...section.items, createEmptyItem()],
    }));
  }

  function deleteItem(sectionIndex: number, itemIndex: number) {
    updateSection(sectionIndex, (section) => ({
      ...section,
      items: section.items.filter((_, currentIndex) => currentIndex !== itemIndex),
    }));
  }

  function moveItem(sectionIndex: number, itemIndex: number, direction: -1 | 1) {
    updateSection(sectionIndex, (section) => {
      const targetIndex = itemIndex + direction;

      if (targetIndex < 0 || targetIndex >= section.items.length) {
        return section;
      }

      return {
        ...section,
        items: moveInArray(section.items, itemIndex, targetIndex),
      };
    });
  }

  async function uploadImage(sectionIndex: number, itemIndex: number, file: File) {
    if (!firebaseStorage) {
      setErrorMessage("Firebase storage is not configured.");
      return;
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const uploadKey = `${sectionIndex}:${itemIndex}`;
    setUploadingKey(uploadKey);
    setErrorMessage("");

    try {
      const storageRef = ref(firebaseStorage, `menu/${Date.now()}-${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      updateItemField(sectionIndex, itemIndex, "image", url);
    } catch (nextError) {
      setErrorMessage(nextError instanceof Error ? nextError.message : "Unable to upload image.");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSave() {
    const validationError = validateSections(sections);

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    if (!firebaseDb) {
      setStatus("error");
      setErrorMessage("Firebase database is not configured.");
      return;
    }

    setStatus("saving");
    setErrorMessage("");

    try {
      await setDoc(doc(firebaseDb, "site-content", "menu"), {
        sections,
        updatedAt: Date.now(),
      });
      setStatus("saved");
    } catch (nextError) {
      setStatus("error");
      setErrorMessage(nextError instanceof Error ? nextError.message : "Unable to save menu.");
    }
  }

  async function handleSignOut() {
    if (!firebaseAuth) {
      return;
    }

    await signOut(firebaseAuth);
  }

  return (
    <section className="section-shell admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="label">Hidden admin</p>
          <h1 className="display-section text-balance">Live menu editor.</h1>
          <p className="admin-topbar-copy">
            Edit copy, prices, order, and photos here. Save writes straight to the live site.
          </p>
        </div>

        <div className="admin-action-row">
          <button className="button button-secondary" type="button" onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save"}
          </button>
          <button className="button button-ghost-dark" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="admin-summary-grid">
        <article className="admin-summary-card">
          <strong>{sections.length}</strong>
          <span>Sections</span>
        </article>
        <article className="admin-summary-card">
          <strong>{sections.reduce((total, section) => total + section.items.length, 0)}</strong>
          <span>Menu items</span>
        </article>
        <article className="admin-summary-card admin-summary-card-wide">
          <strong>Publishing flow</strong>
          <span>Upload or replace photos, then press Save to update the public menu.</span>
        </article>
      </div>

      <div className="admin-status-bar">
        <span>Status: {getStatusCopy(status)}</span>
        {errorMessage ? <span className="admin-error">{errorMessage}</span> : null}
      </div>

      <div className="admin-section-list">
        {sections.map((section, sectionIndex) => (
          <article className="admin-section-card" key={`${section.name}-${sectionIndex}`}>
            <div className="admin-section-meta">
              <div>
                <p className="label">Section {sectionIndex + 1}</p>
                <strong>{section.name || "Untitled section"}</strong>
              </div>
              <span>{section.items.length} item{section.items.length === 1 ? "" : "s"}</span>
            </div>

            <div className="admin-section-head">
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Section name</span>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(event) => updateSectionField(sectionIndex, "name", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Section note</span>
                  <input
                    type="text"
                    value={section.note}
                    onChange={(event) => updateSectionField(sectionIndex, "note", event.target.value)}
                  />
                </label>
              </div>

              <div className="admin-inline-actions">
                <button type="button" onClick={() => moveSection(sectionIndex, -1)}>Move up</button>
                <button type="button" onClick={() => moveSection(sectionIndex, 1)}>Move down</button>
                <button type="button" onClick={() => deleteSection(sectionIndex)}>Delete section</button>
                <button type="button" onClick={() => addItem(sectionIndex)}>Add item</button>
              </div>
            </div>

            <div className="admin-item-list">
              {section.items.map((item, itemIndex) => (
                <article className="admin-item-card" key={`${section.name}-${item.name}-${itemIndex}`}>
                  <div className="admin-item-head">
                    <div>
                      <p className="label">Item {itemIndex + 1}</p>
                      <strong>{item.name || "Untitled item"}</strong>
                    </div>
                  </div>

                  <div className="admin-item-layout">
                    <div className="admin-form-grid">
                      <label className="admin-field">
                        <span>Item name</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) => updateItemField(sectionIndex, itemIndex, "name", event.target.value)}
                        />
                      </label>
                      <label className="admin-field">
                        <span>Price</span>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(event) => updateItemField(sectionIndex, itemIndex, "price", event.target.value)}
                        />
                      </label>
                      <label className="admin-field admin-field-wide">
                        <span>Description</span>
                        <textarea
                          value={item.description}
                          onChange={(event) => updateItemField(sectionIndex, itemIndex, "description", event.target.value)}
                        />
                      </label>
                      <label className="admin-field admin-field-wide">
                        <span>Tags</span>
                        <input
                          type="text"
                          value={item.tags.join(", ")}
                          onChange={(event) => updateItemTags(sectionIndex, itemIndex, event.target.value)}
                          placeholder="Burgers, Popular, Top Picks"
                        />
                      </label>
                      <label className="admin-field admin-field-wide">
                        <span>Image URL</span>
                        <input
                          type="url"
                          value={item.image}
                          onChange={(event) => updateItemField(sectionIndex, itemIndex, "image", event.target.value)}
                          placeholder="https://..."
                        />
                      </label>
                    </div>

                    <aside className="admin-media-panel">
                      <div className="admin-preview-wrap">
                        {item.image ? (
                          <Image
                            className="admin-preview-image"
                            src={item.image}
                            alt={item.name || "Menu item preview"}
                            width={320}
                            height={220}
                          />
                        ) : (
                          <div className="admin-preview-empty">
                            <strong>No image yet</strong>
                            <span>Upload a photo or paste an image URL.</span>
                          </div>
                        )}
                      </div>

                      <label className="admin-upload-field">
                        <span>Upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (!file) {
                              return;
                            }

                            void uploadImage(sectionIndex, itemIndex, file);
                          }}
                        />
                        <small>
                          {uploadingKey === `${sectionIndex}:${itemIndex}`
                            ? "Uploading image..."
                            : "Store photo in Firebase Storage and replace the image URL automatically."}
                        </small>
                      </label>
                    </aside>
                  </div>

                  <div className="admin-item-footer">
                    <div className="admin-inline-actions">
                      <button type="button" onClick={() => moveItem(sectionIndex, itemIndex, -1)}>Move up</button>
                      <button type="button" onClick={() => moveItem(sectionIndex, itemIndex, 1)}>Move down</button>
                      <button type="button" onClick={() => deleteItem(sectionIndex, itemIndex)}>Delete item</button>
                    </div>
                    <span className="admin-item-hint">Drag the order with move buttons, then save.</span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>

      <button className="button button-primary" type="button" onClick={addSection}>
        Add section
      </button>
    </section>
  );
}
