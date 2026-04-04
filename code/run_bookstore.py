from __future__ import annotations

import os
import shutil
import signal
import subprocess
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
API_DIR = ROOT / "Bookstore.Api"
UI_DIR = ROOT / "bookstore-ui"


def resolve_command(command: str) -> str:
    candidates = [command]

    if os.name == "nt" and not command.lower().endswith(".cmd"):
        candidates.insert(0, f"{command}.cmd")

    for candidate in candidates:
        resolved = shutil.which(candidate)
        if resolved is not None:
            return resolved

    raise RuntimeError(f"Required command not found on PATH: {command}")


def ensure_frontend_dependencies(npm_command: str) -> None:
    node_modules = UI_DIR / "node_modules"

    if node_modules.exists():
        return

    print("Installing frontend dependencies with npm install...")
    subprocess.run([npm_command, "install"], cwd=UI_DIR, check=True)


def terminate_process(process: subprocess.Popen[str], title: str) -> None:
    if process.poll() is not None:
        return

    print(f"Stopping {title}...")

    try:
        if os.name == "nt":
            process.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            process.terminate()
    except Exception:
        process.kill()
        return

    try:
        process.wait(timeout=10)
    except subprocess.TimeoutExpired:
        process.kill()


def main() -> int:
    dotnet_command = resolve_command("dotnet")
    npm_command = resolve_command("npm")
    ensure_frontend_dependencies(npm_command)

    creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0

    api_process = None
    ui_process = None

    try:
        api_process = subprocess.Popen(
            [dotnet_command, "run"],
            cwd=API_DIR,
            creationflags=creation_flags,
        )

        ui_process = subprocess.Popen(
            [npm_command, "run", "dev"],
            cwd=UI_DIR,
            creationflags=creation_flags,
        )
    except Exception:
        if ui_process is not None:
            terminate_process(ui_process, "frontend")
        if api_process is not None:
            terminate_process(api_process, "backend")
        raise

    print("Bookstore services are starting...")
    print("Frontend: http://localhost:5173")
    print("Backend:  http://localhost:5015")
    print("Press Ctrl+C to stop both processes.")

    try:
        while True:
            if api_process.poll() is not None:
                print("Backend process exited unexpectedly.")
                return api_process.returncode or 1

            if ui_process.poll() is not None:
                print("Frontend process exited unexpectedly.")
                return ui_process.returncode or 1

            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutdown requested.")
        return 0
    finally:
        if ui_process is not None:
            terminate_process(ui_process, "frontend")
        if api_process is not None:
            terminate_process(api_process, "backend")


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(exc)
        raise SystemExit(1) from exc
