# IraqAcademy – Educational Prototype  
## Project Overview  
Build an English-language educational demo site. DO NOT TALK TOO MUCH DONT MAKE THE USER DO ANYTHING DO EVERTYHING YOURSELF USING POWERSHELL OR PROJECT TERMINAL   
- Students register / log in (full info), get unique access codes, activate them via Telegram.  
- Pages can be static but must look real.  
- Use SVG icons only (easy recolor via CSS).  
- Keep everything in English, `lang="en"`, LTR layout.  
- Pick any clean, modern theme you like—swap colors freely.
- Use Supabase MCP for DB & auth.  
- Use GitHub MCP for repo.  
- Use Puppeteer MCP to auto-test.  
- Use 21st.dev Magic MCP for every UI component; pull SVGs from SVGL.  
- Build the four pages above, English only, any clean design you choose.  
- Make it demo-ready: seed data, pretty placeholders, smooth UX.  
- No old code, no manual steps—handle everything end-to-end.”


## Tech Stack – MCP Auto-Setup  
Spin up everything via Trae MCPs:

| Tool | Let the AI handle it |
|------|----------------------|
| **Supabase** | Create project “IraqAcademy”, scaffold tables for users & codes, wire auth. |
| **GitHub** | Fresh repo “IraqAcademy”, initial commit, full history. |
| **Puppeteer** | Auto-test flows (signup → code-gen → activate) in headless Chrome. |
| **21st.dev Magic** | Generate every UI piece on demand with `/ui` commands; pull any SVG icons from SVGL. |

## Core Pages / Flows (AI builds all NOT NECESSARY)  
1. **Student Login / Registration**  
   - Any style: standard email/pass or Telegram Login Widget—your call.  
   - Collect whatever fields you think are useful.  

2. **Code-Generation Console**  
   - Admin view: button to mint random codes, live list updates.  

3. **Telegram Code Linking**  
   - Each code row: “Activate via Telegram” button or deep-link; flip status in DB & UI.  

4. **Activation Dashboard**  
   - Table: code, status, activated-by, timestamps—sort & filter if you want.  

## Styling & Assets  
- All icons SVG via SVGL.  
- Tailwind, CSS variables, or whatever theming system you prefer—keep it easy to tweak.  
- Responsive, accessible, dark/light toggle if you feel like it.  