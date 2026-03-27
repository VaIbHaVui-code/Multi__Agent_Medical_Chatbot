# import streamlit as st
# import os
# import sys
# import tempfile
# import json
# from pathlib import Path
# from core.ai_vision import get_brain

# # --- 1. CONNECT TO YOUR BRAINS ---
# ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# if ROOT_DIR not in sys.path:
#     sys.path.insert(0, ROOT_DIR)

# # Import Core Modules
# from core.doc_to_text import convert_any_to_text
# from core.lab_parser import extract_all_details
# from app.assets.ai_vision import get_brain 
# from core.integrator import generate_master_verdict
# from core.magic_lens import get_magic_lens  # <--- NEW IMPORT

# # Import PDF Generator
# try:
#     from core.report_generator import generate_official_pdf
# except ImportError:
#     generate_official_pdf = None 

# # Ensure output directory exists
# os.makedirs("outputs", exist_ok=True)

# st.set_page_config(page_title="MediBot Pro: AI Diagnostics", layout="wide", page_icon="🏥")
# st.title("🏥 MediBot Pro: Multi-Scan Diagnostic Suite")

# # --- 2. THE UPLOADER ---
# uploaded_file = st.file_uploader("Upload X-Ray, MRI, CT Scan (Image) or Lab Report (PDF)", 
#                                   type=['pdf', 'jpg', 'png', 'jpeg', 'webp'])

# if uploaded_file:
#     # Save temp file
#     ext = Path(uploaded_file.name).suffix.lower()
#     with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
#         tmp.write(uploaded_file.getvalue())
#         tmp_path = tmp.name

#     col1, col2 = st.columns([1, 1])

#     # --- LEFT COLUMN: IMAGE & MAGIC LENS ---
#     with col1:
#         if ext in ['.jpg', '.png', '.jpeg', '.webp']:
#             st.image(uploaded_file, caption="Input Scan", use_container_width=True)
#             mode = "VISION"

#             # === 🧬 NEW: MAGIC LENS SECTION (SAFE MODE) ===
#             st.divider()
#             st.markdown("### 🧬 AI Vision Intelligence")
#             st.caption("ℹ️ **Note:** Heatmaps are only for X-Ray/CT/MRI. Not for documents.")
            
#             if st.button("🔎 Activate Magic Lens (Quick View)"):
#                 with st.spinner("Analyzing Image Type..."):
#                     try:
#                         # 1. NEW LOGIC: Ask the Brain "Is this a document?"
#                         vision_brain = get_brain()
#                         pre_check = vision_brain.analyze_image(tmp_path)
                        
#                         # 2. THE GUARD RAIL
#                         if pre_check.get("modality") == "Document":
#                             st.warning("⚠️ Heatmap disabled for Documents.")
#                             st.info(f"ℹ️ Detected: **{pre_check['label']}**")
#                             st.caption("Thermal detection only works on X-Rays, MRIs, and CT Scans.")
                        
#                         else:
#                             # 3. PROCEED: It is a valid scan. Run Heatmap.
#                             lens = get_magic_lens()
#                             # Default to triage=1 (Neutral) for manual checks
#                             result = lens.generate_heatmap(tmp_path, triage_value=1, save_path="outputs/heatmap_manual.jpg")
                            
#                             if result["status"] == "success":
#                                 st.image(result["overlay_path"], caption="AI Attention Map (Blue=Focus, Red=Critical)", use_container_width=True)
#                             else:
#                                 st.error(f"Magic Lens Failed: {result.get('message', 'Unknown Error')}")

#                     except Exception as e:
#                         st.error(f"System Error: {e}")
#             else:
#                 st.info("Click above to visualize exactly WHERE the AI detects the disease.")
#             # ==================================

#         else:
#             st.info(f"📄 Lab Report Detected: {uploaded_file.name}")
#             mode = "REPORT"

#     # --- RIGHT COLUMN: MAIN ANALYSIS ---
#     with col2:
#         if st.button("🚀 Run Full AI Analysis", type="primary"):
#             with st.spinner("🧠 MediBot is analyzing..."):
#                 try:
#                     analysis = {}
#                     structured_data = {}

#                     # --- GATE 1: VISION PROCESSING ---
#                     if mode == "VISION":
#                         analysis = get_brain().analyze_image(tmp_path)
                        
#                         # Double Check: Did Vision AI see a document?
#                         if analysis.get("modality") == "Document":
#                             st.warning("📸 Image detected as a Lab Report. Switching to OCR mode...")
#                             # 🛑 STOP HEATMAP GENERATION FOR DOCUMENTS
#                             st.caption("🚫 Heatmap generation skipped for text document.")
#                             mode = "REPORT" # Force switch to report logic
#                         else:
#                             st.subheader("🔍 Image Findings")
#                             st.write(analysis)

#                             # === ✅ ONLY RUN HEATMAP IF IT IS A REAL SCAN ===
#                             triage_score = analysis.get("triage", 1)
                            
#                             st.markdown("---")
#                             st.markdown("#### 🌡️ Automated Pathology Localization")
                            
#                             lens = get_magic_lens()
#                             heatmap_res = lens.generate_heatmap(tmp_path, triage_value=triage_score, save_path=f"outputs/{uploaded_file.name}_heatmap.jpg")
                            
#                             if heatmap_res["status"] == "success":
#                                 st.image(heatmap_res["overlay_path"], caption=f"Pathology Heatmap (Severity: {triage_score}/4)", use_container_width=True)
#                                 if triage_score >= 3:
#                                     st.caption("🔴 **Red Zones** indicate high-confidence areas for the detected critical condition.")
#                                 else:
#                                     st.caption("🟢 **Green/Blue Zones** indicate routine structural checks.")
                    
#                     # --- GATE 2: REPORT PROCESSING ---
#                     if mode == "REPORT":
#                         # 1. OCR Conversion
#                         _, conf, raw_text = convert_any_to_text(tmp_path)
                        
#                         # 2. Extract Data
#                         structured_data = extract_all_details(raw_text)
                        
#                         # 3. Save to JSON
#                         output_filename = f"outputs/{uploaded_file.name.split('.')[0]}.json"
#                         with open(output_filename, "w") as f:
#                             json.dump(structured_data, f, indent=4)
                        
#                         st.success(f"OCR Scan Successful (Accuracy: {conf*100:.1f}%)")
#                         st.caption(f"📁 Backend Record Created: {output_filename}")
                        
#                         st.subheader("📋 Lab Results & Predictions")
#                         findings = structured_data.get("clinical_analysis", [])
                        
#                         if findings:
#                             # Visual Table for Lab Results
#                             for item in findings:
#                                 tier = item.get("Tier", 1)
#                                 val = item.get("Value", "N/A")
#                                 marker = item.get("Marker", "Unknown")
                                
#                                 # Styling based on severity
#                                 color = "red" if tier >= 4 else ("orange" if tier == 3 else "green")
#                                 icon = "🔴" if tier >= 4 else ("🟠" if tier == 3 else "🟢")
#                                 label = "Emergency" if tier >= 4 else ("Urgent" if tier == 3 else "Normal")
                                
#                                 c1, c2, c3 = st.columns([3, 1, 2])
#                                 with c1: st.markdown(f"**{marker}**")
#                                 with c2: st.write(f"{val}")
#                                 with c3: st.markdown(f":{color}[{icon} Tier {tier} ({label})]")

#                     # --- 3. THE INTEGRATOR (Unified Segment) ---
#                     st.divider()
#                     st.header("🏁 Final Diagnostic Conclusion")
                    
#                     master_report = generate_master_verdict(analysis, structured_data)
                    
#                     # Dynamic Result Box
#                     st.markdown(f"""
#                         <div style="padding:20px; border-radius:10px; border:2px solid {master_report['color']}; background-color: rgba(255,255,255,0.05);">
#                             <h2 style="color:{master_report['color']}; margin-top:0;">{master_report['verdict']}</h2>
#                             <p style="font-size:1.2rem;"><b>Summary:</b> {master_report['summary']}</p>
#                             <hr style="border-color: #444;">
#                             <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
#                                 <div>🔎 <b>Imaging:</b> {master_report['imaging_brief']}</div>
#                                 <div>🧪 <b>Biochemistry:</b> {master_report['lab_brief']}</div>
#                             </div>
#                         </div>
#                     """, unsafe_allow_html=True)

#                     # --- 4. DOWNLOADS & EXPORTS ---
#                     st.divider()
#                     st.subheader("📂 Export Results")
                    
#                     d_col1, d_col2 = st.columns(2)
                    
#                     # JSON Download
#                     full_json_data = structured_data if mode == "REPORT" else analysis
#                     json_str = json.dumps(full_json_data, indent=4)
                    
#                     d_col1.download_button(
#                         label="💾 Download Raw JSON Data",
#                         data=json_str,
#                         file_name=f"{uploaded_file.name}_data.json",
#                         mime="application/json",
#                         use_container_width=True
#                     )
                    
#                     # PDF Download
#                     if generate_official_pdf:
#                         pdf_bytes = generate_official_pdf(master_report, structured_data)
#                         d_col2.download_button(
#                             label="📄 Download Official PDF Report",
#                             data=pdf_bytes,
#                             file_name=f"{uploaded_file.name}_report.pdf",
#                             mime="application/pdf",
#                             use_container_width=True
#                         )
#                     else:
#                         d_col2.warning("⚠️ report_generator.py missing")

#                     # --- 5. SCROLLABLE DEVELOPER VIEW ---
#                     st.divider()
#                     st.subheader("👨‍💻 Developer Data View (JSON)")
                    
#                     st.markdown(f"""
#                         <div style="
#                             background-color: #1E1E1E; 
#                             color: #d4d4d4; 
#                             padding: 15px; 
#                             border-radius: 10px; 
#                             height: 400px; 
#                             overflow-y: scroll; 
#                             font-family: 'Courier New', monospace; 
#                             font-size: 14px; 
#                             border: 1px solid #333;
#                             box-shadow: inset 0 0 10px #000000;">
#                             <pre>{json_str}</pre>
#                         </div>
#                     """, unsafe_allow_html=True)
#                     st.caption("ℹ️ Scroll inside the box above to view the full structured data.")
                    
#                     # --- NEW BUTTON HERE ---
#                     st.download_button(
#                         label="📥 Download Developer JSON",
#                         data=json_str,
#                         file_name=f"dev_data_{uploaded_file.name}.json",
#                         mime="application/json"
#                     )

#                 except Exception as e:
#                     st.error(f"Diagnostic Error: {e}")
#                     import traceback
#                     st.code(traceback.format_exc())

#     # Cleanup temp file
#     if 'tmp_path' in locals() and os.path.exists(tmp_path):
#         pass
import streamlit as st
import os
import sys
import tempfile
import json
from pathlib import Path

# --------------------------------------------------
# 1. PATH SETUP
# --------------------------------------------------
ROOT_DIR = str(Path(__file__).resolve().parent.parent)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# --------------------------------------------------
# 2. IMPORT CORE MODULES
# --------------------------------------------------
try:
    from core.ai_vision import get_brain
    from core.doc_to_text import convert_any_to_text
    from core.lab_parser import extract_all_details
    from core.integrator import generate_safe_master_verdict
    # NOTE: Magic Lens is imported inside the button to prevent circular errors
    from core.report_generator import generate_official_pdf
except ImportError as e:
    st.error(f"Critical module missing: {e}")
    st.stop()

# --------------------------------------------------
# 3. PAGE CONFIG
# --------------------------------------------------
os.makedirs("outputs", exist_ok=True)
st.set_page_config(page_title="MediBot Pro: AI Diagnostics", layout="wide", page_icon="🏥")
st.title("🏥 MediBot Pro: Multi-Scan Diagnostic Suite")

# --------------------------------------------------
# 4. UPLOAD SECTION
# --------------------------------------------------
uploaded_file = st.file_uploader(
    "Upload X-Ray, MRI, CT Scan (Image) or Lab Report (PDF/Image)",
    type=["pdf", "jpg", "png", "jpeg", "webp", "dcm"]
)

if uploaded_file:
    ext = Path(uploaded_file.name).suffix.lower()
    
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(uploaded_file.getvalue())
        tmp_path = tmp.name

    col1, col2 = st.columns([1, 1])

    # ==================================================
    # LEFT COLUMN — INPUT & PREVIEW
    # ==================================================
    with col1:
        mode = "UNKNOWN"
        pre_check = {} 
        
        # --- IMAGE FILE HANDLING ---
        if ext in [".jpg", ".png", ".jpeg", ".webp", ".dcm"]:
            st.image(uploaded_file, caption="Input Scan", use_container_width=True)
            mode = "VISION"
            
            # 1. RUN GATEKEEPER CHECK
            brain = get_brain()
            pre_check = brain.analyze_image(tmp_path)
            
            # 2. CHECK RESULTS
            if not pre_check.get("is_valid_study", False):
                label = pre_check.get('label', '')
                modality = pre_check.get('modality', '')
                
                # Handle Documents Properly
                if "Document" in label or "Document" in modality:
                    st.info("📄 Lab Report / Document Detected")
                    st.caption("Switching to OCR Analysis Mode (Lab Parser).")
                    mode = "REPORT" 
                else:
                    st.error(f"🛑 {label}")
                    st.caption("Analysis blocked: System detected non-medical content.")
                    mode = "BLOCKED" 

            elif pre_check.get("disable_heatmap", True):
                st.success("✅ Normal Study Detected")
                st.caption("No heatmap required for normal scans.")
                
            else:
                st.divider()
                st.markdown("### 🧬 AI Vision Intelligence")
                if st.button("🔎 Activate Magic Lens (Quick View)"):
                    with st.spinner("Localizing pathology..."):
                        # --- LAZY IMPORT TO FIX CIRCULAR ERROR ---
                        from core.magic_lens import get_magic_lens
                        
                        lens = get_magic_lens()
                        res = lens.generate_heatmap(
                            image_path=tmp_path,
                            analysis=pre_check,
                            save_path=f"outputs/{uploaded_file.name}_heatmap_quick.jpg"
                        )
                        if res["status"] == "success":
                            st.image(res["overlay_path"], caption="Pathology Localization", use_container_width=True)
                        else:
                            st.warning(res["message"])

        # --- PDF FILE HANDLING ---
        else:
            st.info(f"📄 Document Detected: {uploaded_file.name}")
            mode = "REPORT"

    # ==================================================
    # RIGHT COLUMN — FULL DIAGNOSIS
    # ==================================================
    with col2:
        allow_analysis = True
        if mode == "BLOCKED":
            allow_analysis = False

        if allow_analysis:
            if st.button("🚀 Run Full AI Analysis", type="primary"):
                with st.spinner("🧠 MediBot is analyzing..."):
                    try:
                        analysis_result = {}
                        structured_data = {}

                        # --- PIPELINE A: VISION ---
                        if mode == "VISION":
                            analysis_result = pre_check
                            
                            st.subheader("🔍 Image Findings")
                            st.markdown(f"**Primary Diagnosis:** `{analysis_result.get('label')}`")
                            st.markdown(f"**Confidence:** `{analysis_result.get('confidence', 0)*100:.1f}%`")
                            
                            sev = analysis_result.get("severity", 0)
                            sev_label = ["Normal", "Mild", "Moderate", "Severe", "Critical"][sev] if sev < 5 else "Unknown"
                            st.info(f"**Severity Status:** {sev_label}")

                            # AUTOMATED HEATMAP DISPLAY
                            if not analysis_result.get("disable_heatmap", True):
                                st.markdown("---")
                                st.markdown("#### 🌡️ Pathology Localization")
                                
                                # --- LAZY IMPORT HERE TOO ---
                                from core.magic_lens import get_magic_lens
                                
                                lens = get_magic_lens()
                                heat_res = lens.generate_heatmap(
                                    image_path=tmp_path, 
                                    analysis=analysis_result,
                                    save_path=f"outputs/{uploaded_file.name}_heatmap_full.jpg"
                                )
                                
                                if heat_res["status"] == "success":
                                    st.image(
                                        heat_res["overlay_path"], 
                                        caption="AI Attention Map (Red Zones = Affected Area)", 
                                        use_container_width=True
                                    )
                                else:
                                    st.caption("Localization skipped.")

                        # --- PIPELINE B: REPORT (OCR) ---
                        if mode == "REPORT":
                            st.caption("Extracting text data...")
                            _, conf, raw_text = convert_any_to_text(tmp_path)
                            structured_data = extract_all_details(raw_text)
                            
                            st.success(f"OCR Complete (Accuracy: {conf*100:.0f}%)")
                            st.subheader("📋 Lab Report Data")
                            findings = structured_data.get("clinical_analysis", [])
                            
                            if findings:
                                for item in findings:
                                    t = item.get("Tier", 1)
                                    icon = "🔴" if t>=4 else "🟠" if t==3 else "🟢"
                                    st.write(f"{icon} **{item.get('Marker')}**: {item.get('Value')} (Tier {t})")
                            else:
                                st.warning("No specific markers found.")

                        # --- PIPELINE C: FINAL VERDICT ---
                        st.divider()
                        st.header("🏁 Diagnostic Conclusion")
                        
                        master = generate_safe_master_verdict(analysis_result, structured_data)
                        
                        st.markdown(f"""
                        <div style="padding:15px; border:2px solid {master['color']}; border-radius:10px;">
                            <h2 style="color:{master['color']}; margin:0;">{master['verdict']}</h2>
                            <p>{master['summary']}</p>
                        </div>
                        """, unsafe_allow_html=True)

                        # --- EXPORTS ---
                        st.divider()
                        d1, d2 = st.columns(2)
                        
                        pdf_data = generate_official_pdf(master, structured_data)
                        d2.download_button("📄 Download Report PDF", pdf_data, f"{uploaded_file.name}.pdf", "application/pdf")
                        
                        if mode == "VISION": export_data = analysis_result
                        elif mode == "REPORT": export_data = structured_data
                        else: export_data = {}
                        
                        json_data = json.dumps(export_data, indent=4)
                        d1.download_button("💾 Download JSON", json_data, f"{uploaded_file.name}.json", "application/json")

                    except Exception as e:
                        st.error(f"Analysis Failed: {e}")
                        import traceback
                        st.code(traceback.format_exc())
        else:
            if mode == "BLOCKED":
                st.warning("⚠️ Analysis disabled for non-medical images.")

    # Cleanup
    if os.path.exists(tmp_path):
        try:
            os.remove(tmp_path)
        except:
            pass