// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Default, Debug, serde::Serialize, serde::Deserialize)]
struct CommandlineResult {
    stdout: String,
    stderr: String,
    status: Option<i32>,
    dir: String,
    args:Vec<String>,
    program: String
}


#[tauri::command]
async fn run(program:&str,dir:&str,args:Vec<&str>) -> Result<CommandlineResult,CommandlineResult> {
    let mut result = CommandlineResult {
        stdout: "".to_string(),
        stderr: "".to_string(),
        status: Option::None,
        dir: dir.to_string(),
        args: args.iter().map(|s| s.to_string()).collect(),
        program: program.to_string()
    };

    let mut shell = std::process::Command::new(program);
    shell.current_dir(dir);
    shell.args(args);

    let output = shell.output();
    match output {
        Ok(output) => {
            result.status = output.status.code();
            result.stdout = format!("{}", String::from_utf8_lossy(&output.stdout));
            return Ok(result)
        },
        Err(e) => {
            result.status = Option::Some(-1);
            result.stderr = format!("Error: {}", e);
            return Err(result)
        }
    };
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, run])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
