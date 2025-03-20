from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai

# Configure the Gemini API
genai.configure(api_key='AIzaSyAMXpT4_ywSoRWOmv2r8zHqAkE_peWBaj4')  # Replace with your actual API key

@csrf_exempt
def generate_report(request):
    if request.method == 'POST':
        try:
            # Parse the request body
            data = json.loads(request.body)
            user_prompt = data.get('user_prompt')

            if not user_prompt:
                return JsonResponse({'error': 'user_prompt is required'}, status=400)

            # Initialize the Gemini model
            model = genai.GenerativeModel('gemini-pro')

            # Generate the report with strict structure
            response = model.generate_content(
                     f"Generate a threat intelligence report for: {user_prompt}. "
                     "Structure the report EXACTLY as follows:\n\n"
                     "### Executive Summary\n[Your text here]\n\n"
                     "### Key Details\n[Your text here]\n\n"
                     "### CVE Mapping\n[Your text here]\n\n"
                     "### Actionable Insights\n[Your text here]\n\n"
                     "IMPORTANT: If any section contains bullet points, ensure that each point is written on a separate line."
)

            # Debugging: Print raw response
            print("Raw Gemini Response:", response.text)

            if response.text:
                # Parse sections using clear delimiters
                report_text = response.text
                sections = {
                    "executiveSummary": "",
                    "keyDetails": "",
                    "cveMapping": "",
                    "actionableInsights": ""
                }

                # Split sections using ### headers
                current_section = None
                for line in report_text.split('\n'):
                    if line.startswith('### Executive Summary'):
                        current_section = 'executiveSummary'
                        sections[current_section] = line.replace('### Executive Summary', '').strip()
                    elif line.startswith('### Key Details'):
                        current_section = 'keyDetails'
                        sections[current_section] = line.replace('### Key Details', '').strip()
                    elif line.startswith('### CVE Mapping'):
                        current_section = 'cveMapping'
                        sections[current_section] = line.replace('### CVE Mapping', '').strip()
                    elif line.startswith('### Actionable Insights'):
                        current_section = 'actionableInsights'
                        sections[current_section] = line.replace('### Actionable Insights', '').strip()
                    elif current_section:
                        sections[current_section] += '\n' + line.strip()

                # Remove empty lines and trim whitespace
                for key in sections:
                    sections[key] = '\n'.join([line.strip() for line in sections[key].split('\n') if line.strip()])

                print("Structured Data:", sections)
                return JsonResponse({'report_data': sections})

            return JsonResponse({'error': 'Empty response from Gemini'}, status=500)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)