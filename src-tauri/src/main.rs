#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, Submenu};

// Functions
fn meeting_info_window(handle: tauri::AppHandle) {
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

fn settings_window(handle: tauri::AppHandle) {
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

// Comands
#[tauri::command]
async fn open_meeting_info(handle: tauri::AppHandle) {
  meeting_info_window(handle)
}

#[tauri::command]
async fn open_settings(handle: tauri::AppHandle) {
  settings_window(handle)
}

fn main() {
  // Menu
  let settings = CustomMenuItem::new("Ajustes".to_string(), "Ajustes");
  let meeting_info = CustomMenuItem::new("Información de reuniones".to_string(), "Información de reuniones");
  let sub_menu = Submenu::new("Archivo", Menu::new().add_item(settings).add_item(meeting_info));
  let menu = Menu::new().add_submenu(sub_menu);
    
  tauri::Builder::default()
        // Main window
        .setup(|app| {
          let handle = app.handle(); // Created App handle
          let default_window = tauri::WindowBuilder::new( // Created the main window
            app,
            "main-window",
            tauri::WindowUrl::App("index.html".into()),
          )
          .title("Meeting planner")
          .fullscreen(false)
          .inner_size(800.0, 600.0)
          .resizable(true)
          .min_inner_size(550.0, 600.0)
          .menu(menu)
          .build()?;
        
          // Handling menu cases          
          let default_window = default_window.clone();
          default_window.on_menu_event(move |event| {
            match event.menu_item_id() {
              "Ajustes" => {
                let handle = handle.clone();
                std::thread::spawn(move || {
                  settings_window(handle)
                });
              },
              "Información de reuniones" => {
                let handle = handle.clone();
                std::thread::spawn(move || {
                  meeting_info_window(handle)
                });
              },
              _ => {}
            }
          });

          Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_meeting_info, open_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
