#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
async fn open_meeting_info(handle: tauri::AppHandle) {
  tauri::WindowBuilder::new(
    &handle,
    "info",
    tauri::WindowUrl::App("meeting_info.html".into())
  )
  .title("Meeting info")
  .resizable(false)
  .maximized(false)
  .inner_size(500.0, 700.0)
  .build()
  .unwrap();
}

#[tauri::command]
async fn open_settings(handle: tauri::AppHandle) {
  tauri::WindowBuilder::new(
    &handle,
    "settings",
    tauri::WindowUrl::App("settings.html".into())
  )
  .title("Settings")
  .resizable(false)
  .maximized(false)
  .inner_size(800.0, 600.0)
  .build()
  .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_meeting_info, open_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
