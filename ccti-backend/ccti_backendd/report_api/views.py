from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai

# Configuration storage (in-memory, will reset on server restart)
SYSTEM_CONFIG = {
    'email_settings': {
        'EMAIL_HOST': 'smtp.gmail.com',
        'EMAIL_PORT': 587,
        'EMAIL_HOST_USER': 'saleemahmad2210@gmail.com',
        'EMAIL_HOST_PASSWORD': 'fmli dkjj gpfy lrfy',
        'DEFAULT_FROM_EMAIL': 'saleemahmad2210@gmail.com'
    },
    'gemini_api_key': 'AIzaSyAMXpT4_ywSoRWOmv2r8zHqAkE_peWBaj4'
}

HARDCODED_USERS = {
    'admin': {'password': 'password123', 'role': 'admin'},
    'user': {'password': 'userpass', 'role': 'user'},
    'config_admin': {'password': 'config123', 'role': 'access_manager'}
}

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            # Print raw request body for debugging
            print("Raw request body:", request.body)
            
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            print(f"Login attempt - Username: {username}, Password: {password}")  # Debug log
            
            if not username or not password:
                return JsonResponse({
                    'success': False,
                    'error': 'Username and password are required'
                }, status=400)
            
            # Check against hardcoded users
            if username in HARDCODED_USERS and password == HARDCODED_USERS[username]['password']:
                print("Login successful for:", username)  # Debug log
                return JsonResponse({
                    'success': True,
                    'username': username,
                    'role': HARDCODED_USERS[username]['role']
                })
            else:
                print("Invalid credentials for:", username)  # Debug log
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid credentials'
                }, status=401)
                
        except json.JSONDecodeError:
            print("Invalid JSON received")  # Debug log
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON format'
            }, status=400)
        except Exception as e:
            print("Login error:", str(e))  # Debug log
            return JsonResponse({
                'success': False,
                'error': 'Internal server error'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Method not allowed'
    }, status=405)

@csrf_exempt
def generate_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_prompt = data.get('user_prompt')

            if not user_prompt:
                return JsonResponse({'error': 'user_prompt is required'}, status=400)

            # Initialize Gemini with the configured API key
            genai.configure(api_key=SYSTEM_CONFIG['gemini_api_key'])
            model = genai.GenerativeModel('gemini-1.5-pro')

            response = model.generate_content(
                f"Generate a threat intelligence report for: {user_prompt}. "
                "Structure the report EXACTLY as follows:\n\n"
                "### Executive Summary\n[Your text here]\n\n"
                "### Key Details\n[Your text here]\n\n"
                "### CVE Mapping\n[Your text here]\n\n"
                "### Actionable Insights\n[Your text here]\n\n"
                "IMPORTANT: If any section contains bullet points, ensure that each point is written on a separate line."
            )

            report_text = response.text
            sections = {
                "executiveSummary": "",
                "keyDetails": "",
                "cveMapping": "",
                "actionableInsights": ""
            }

            # Parse sections
            current_section = None
            for line in report_text.split('\n'):
                if line.startswith('### Executive Summary'):
                    current_section = 'executiveSummary'
                elif line.startswith('### Key Details'):
                    current_section = 'keyDetails'
                elif line.startswith('### CVE Mapping'):
                    current_section = 'cveMapping'
                elif line.startswith('### Actionable Insights'):
                    current_section = 'actionableInsights'
                elif current_section and not line.startswith('###'):
                    sections[current_section] += line + '\n'

            return JsonResponse({'report_data': sections})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# views.py
@csrf_exempt
def get_configurations(request):
    if request.method == 'GET':
        return JsonResponse({
            'success': True,
            'configurations': {
                'email_settings': {
                    'EMAIL_HOST': 'smtp.gmail.com',
                    'EMAIL_PORT': 587,
                    'EMAIL_HOST_USER': 'saleemahmad2210@gmail.com',
                    'EMAIL_HOST_PASSWORD': 'fmli dkjj gpfy lrfy',
                    'DEFAULT_FROM_EMAIL': 'saleemahmad2210@gmail.com'
                },
                'gemini_api_key': 'AIzaSyAMXpT4_ywSoRWOmv2r8zHqAkE_peWBaj4',
                'gemini_version': 'gemini-1.5-pro',
                'users': {
                    'admin': {'password': 'password123', 'role': 'admin'},
                    'user': {'password': 'userpass', 'role': 'user'},
                    'config_admin': {'password': 'config123', 'role': 'access_manager'}
                }
            }
        })
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def update_configurations(request):
    if request.method == 'POST':
        global TEST_CONFIG
        TEST_CONFIG = json.loads(request.body).get('configurations', {})
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Method not allowed'}, status=405)