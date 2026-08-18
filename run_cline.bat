@echo off
echo Running cline...
echo. | call cline --auto-approve true -P ollama -m qwen2.5-coder:14b "Please read active_etf_plan.md and implement the exact WBS plan."
echo Finished!
