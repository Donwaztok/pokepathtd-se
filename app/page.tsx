"use client";

import {
  AreaSection,
  BoxSection,
  PlayerSection,
  ShopSection,
  TeamSection,
} from "@/components/editor";
import { siteConfig } from "@/config/site";
import type { SaveData } from "@/types/save";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Textarea } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { useCallback, useRef, useState } from "react";

function decodeBase64(input: string): SaveData {
  const base64 = input.trim().replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const decoded = new TextDecoder().decode(bytes);

  return JSON.parse(decoded) as SaveData;
}

function encodeToBase64(data: SaveData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);

  return btoa(binary);
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [saveData, setSaveData] = useState<SaveData | null>(null);
  const saveDataRef = useRef<SaveData | null>(null);
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSaveDataChange = useCallback((next: SaveData | null) => {
    saveDataRef.current = next;
    setSaveData(next);
  }, []);

  const decode = useCallback(() => {
    setError("");
    const input = inputValue.trim();

    if (!input) {
      setError("Paste the string or load a .txt file");

      return;
    }
    try {
      const decoded = decodeBase64(input);

      handleSaveDataChange(decoded);
      setOutputValue("");
    } catch {
      setError("Invalid string. Check the Base64 format.");
      handleSaveDataChange(null);
    }
  }, [inputValue, handleSaveDataChange]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
          const text = event.target?.result as string;

          setInputValue(text?.trim() ?? "");
        };
        reader.readAsText(file);
      }
    },
    [],
  );

  const saveAndEncode = useCallback(() => {
    const data = saveDataRef.current ?? saveData;

    if (!data) {
      setError("Decode a save before encoding.");

      return;
    }
    setError("");
    const encoded = encodeToBase64(data);

    setOutputValue(encoded);
  }, [saveData]);

  const downloadOutput = useCallback(() => {
    const blob = new Blob([outputValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "modified-save.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputValue]);

  const [copyFeedback, setCopyFeedback] = useState(false);
  const copyOutput = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      navigator.clipboard.writeText(outputValue);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, [outputValue]);

  const [activeTab, setActiveTab] = useState<string>("player");
  const [jsonEditValue, setJsonEditValue] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const syncJsonFromSave = useCallback(() => {
    if (saveData) setJsonEditValue(JSON.stringify(saveData, null, 2));
  }, [saveData]);

  const applyJsonEdit = useCallback(() => {
    setJsonError(null);
    const raw = jsonEditValue.trim();

    if (!raw) {
      setJsonError("Enter the JSON.");

      return;
    }
    try {
      const parsed = JSON.parse(raw) as SaveData;

      if (typeof parsed !== "object" || parsed === null) {
        setJsonError("JSON must be an object.");

        return;
      }
      handleSaveDataChange(parsed);
      setJsonEditValue(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON.");
    }
  }, [jsonEditValue]);

  const formatJson = useCallback(() => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonEditValue.trim());

      setJsonEditValue(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON.");
    }
  }, [jsonEditValue]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
          Poké Path Save Editor
        </h1>
        <p className="text-default-500 mt-1">
          Edit your Poké Path TD save — decode, modify and encode again
        </p>
        <p className="text-default-400 text-sm mt-2">
          Designed for game version 1.4.1. If you run into issues, please{" "}
          <a
            className="text-primary underline underline-offset-2 hover:opacity-80"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            open an issue on GitHub
          </a>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Input</h2>
        </CardHeader>
        <CardBody className="gap-4">
          <div className="flex flex-wrap gap-2">
            <input
              accept=".txt"
              className="hidden"
              id="file-input"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              as="label"
              htmlFor="file-input"
              size="sm"
              variant="bordered"
            >
              Choose .txt file
            </Button>
            {fileName && <Chip size="sm">{fileName}</Chip>}
          </div>
          <Textarea
            label="Save string (Base64)"
            maxRows={6}
            minRows={3}
            placeholder="Paste your Base64 string or load a file"
            value={inputValue}
            onValueChange={setInputValue}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button color="primary" onPress={decode}>
            Decode
          </Button>
        </CardBody>
      </Card>

      {saveData && (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Edit save</h2>
            </CardHeader>
            <CardBody>
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(k) => {
                  const key = k == null ? "player" : String(k);

                  setActiveTab(key);
                  if (key === "json") syncJsonFromSave();
                }}
              >
                <Tab key="player" title="👤 Player">
                  <div className="py-4">
                    <PlayerSection
                      data={saveData}
                      onChange={handleSaveDataChange}
                    />
                  </div>
                </Tab>
                <Tab key="team" title="⚔️ Team">
                  <div className="py-4">
                    <TeamSection
                      data={saveData}
                      onChange={handleSaveDataChange}
                    />
                  </div>
                </Tab>
                <Tab key="box" title="📦 Box">
                  <div className="py-4">
                    <BoxSection
                      data={saveData}
                      onChange={handleSaveDataChange}
                    />
                  </div>
                </Tab>
                <Tab key="area" title="🗺️ Area">
                  <div className="py-4">
                    <AreaSection
                      data={saveData}
                      onChange={handleSaveDataChange}
                    />
                  </div>
                </Tab>
                <Tab key="shop" title="🛒 Shop">
                  <div className="py-4">
                    <ShopSection
                      data={saveData}
                      onChange={handleSaveDataChange}
                    />
                  </div>
                </Tab>
                <Tab key="json" title="📄 JSON">
                  <div className="py-4 space-y-4">
                    <p className="text-default-500 text-sm">
                      Edit the entire save in JSON. Fields:{" "}
                      <code className="bg-default-100 px-1 rounded">new</code>,{" "}
                      <code className="bg-default-100 px-1 rounded">
                        player
                      </code>
                      ,{" "}
                      <code className="bg-default-100 px-1 rounded">team</code>,{" "}
                      <code className="bg-default-100 px-1 rounded">box</code>,{" "}
                      <code className="bg-default-100 px-1 rounded">area</code>,{" "}
                      <code className="bg-default-100 px-1 rounded">shop</code>,{" "}
                      <code className="bg-default-100 px-1 rounded">
                        teamManager
                      </code>
                      .
                    </p>
                    <Textarea
                      classNames={{ input: "font-mono text-sm" }}
                      label="Save JSON"
                      maxRows={40}
                      minRows={20}
                      placeholder="{}"
                      value={jsonEditValue}
                      onValueChange={(v) => {
                        setJsonEditValue(v);
                        setJsonError(null);
                      }}
                    />
                    {jsonError && (
                      <p className="text-danger text-sm">{jsonError}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button color="primary" onPress={applyJsonEdit}>
                        Apply changes
                      </Button>
                      <Button size="sm" variant="bordered" onPress={formatJson}>
                        Format JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={syncJsonFromSave}
                      >
                        Reload from current save
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="gap-4">
              <Button color="primary" size="lg" onPress={saveAndEncode}>
                Save and encode
              </Button>
            </CardBody>
          </Card>
        </>
      )}

      {outputValue && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Output (Base64)</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="p-2 rounded-lg bg-default-100 break-all text-xs max-h-32 overflow-auto">
              {outputValue.slice(0, 150)}...
            </div>
            <div className="flex gap-2">
              <Button
                color={copyFeedback ? "success" : "default"}
                variant="bordered"
                onPress={copyOutput}
              >
                {copyFeedback ? "Copied!" : "Copy"}
              </Button>
              <Button color="primary" onPress={downloadOutput}>
                Download .txt
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
