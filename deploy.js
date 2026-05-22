import { execSync } from "child_process";
import { cpSync, rmSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

// ============================================================
// CONFIGURAZIONE
// ============================================================
const APP_NAME       = "nome-app";
const WP_PLUGIN_PATH = "C:/Users/GiuseppeSabia/Local Sites/provaplugin/app/public/wp-content/plugins/wp-app-loader/apps";
const WP_BASE_URL    = "http://provaplugin.local";
// ============================================================

const src        = resolve("dist");
const destParent = resolve(WP_PLUGIN_PATH, APP_NAME);
const dest       = resolve(destParent, "dist");

console.log("🔨 Building...");
execSync("vite build", { stdio: "inherit" });

console.log("🗑️  Rimozione vecchi file...");
if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
if (!existsSync(destParent)) mkdirSync(destParent, { recursive: true });

console.log("📦 Copia in WordPress...");
cpSync(src, dest, { recursive: true });

console.log("✅ Deploy completato!");
console.log(`🌐 Apri: ${WP_BASE_URL}/app/${APP_NAME}/`);