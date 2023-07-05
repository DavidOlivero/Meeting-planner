#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
async fn open_meeting_info(handle: tauri::AppHandle) {
  tauri::WindowBuilder::new(
    &handle,
    "local",
    tauri::WindowUrl::App("meeting_info.html".into())
  )
  .title("Meeting info")
  .resizable(false)
  .maximized(false)
  .inner_size(500.0, 700.0)
  .build()
  .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_meeting_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
