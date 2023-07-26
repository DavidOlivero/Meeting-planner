#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, Submenu};

// Comands
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
  // Menu
  let settings = CustomMenuItem::new("Ajustes".to_string(), "Ajustes");
  let meeting_info = CustomMenuItem::new("Información de reuniones".to_string(), "Información de reuniones");
  let sub_menu = Submenu::new("Archivo", Menu::new().add_item(settings).add_item(meeting_info));
  let menu = Menu::new().add_submenu(sub_menu);
    
  tauri::Builder::default()
        // Main window
        .setup(|app| {
          let handle = app.handle();
          let default_window = tauri::WindowBuilder::new(
            app,
            "main-window",
            tauri::WindowUrl::App("index.html".into()),
          )
          .title("Meeting planner")
          .fullscreen(false)
          .inner_size(800.0, 600.0)
          .resizable(true)
          .menu(menu)
          .build()?;
        
          let default_window = default_window.clone();
          default_window.on_menu_event(move |event| {
            match event.menu_item_id() {
              "Ajustes" => {
                let handle = handle.clone();
                std::thread::spawn(move || {
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
                });
              },
              "Información de reuniones" => {
                let handle = handle.clone();
                std::thread::spawn(move || {
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
