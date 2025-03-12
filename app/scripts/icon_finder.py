import os
import requests
from pathlib import Path

# Choose where to save the icons - can be either src or public
# For public directory (recommended for Next.js):
skills_dir = Path("public/images/skills")
# For src directory:
#skills_dir = Path("src/images/skills")

skills_dir.mkdir(parents=True, exist_ok=True)

print(f"Target directory: {skills_dir.resolve()}")

# Enhanced list with more reliable URLs for problematic icons
skill_icons = [
    # Core cloud platforms
    {"name": "aws", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg"},
    {"name": "azure", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftazure.svg"},
    {"name": "gcp", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/googlecloud.svg"},
    
    # Programming languages
    {"name": "python", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/python.svg"},
    {"name": "typescript", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/typescript.svg"},
    {"name": "bash", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gnubash.svg"},
    {"name": "java", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/openjdk.svg"},
    {"name": "csharp", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/csharp.svg"},
    
    # Infrastructure tools
    {"name": "terraform", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/terraform.svg"},
    {"name": "docker", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/docker.svg"},
    {"name": "kubernetes", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/kubernetes.svg"},
    
    # Monitoring & Observability
    {"name": "newrelic", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/newrelic.svg"},
    {"name": "prometheus", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/prometheus.svg"},
    {"name": "datadog", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/datadog.svg"},
    {"name": "cloudwatch", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg"},
    {"name": "splunk", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/splunk.svg"},
    
    # CI/CD tools
    {"name": "github-actions", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/githubactions.svg"},
    {"name": "gitops", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/git.svg"},
    {"name": "argocd", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/argo.svg"},
    {"name": "bitbucket", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/bitbucket.svg"},
    {"name": "codepipeline", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg"}
]

# Function to add color to an SVG
def add_color_to_svg(svg_content, color_code="#000000"):
    # Simple approach: Add fill attribute to the first path or other element if there's no fill already
    if 'fill="' not in svg_content and "<path" in svg_content:
        svg_content = svg_content.replace("<path", f'<path fill="{color_code}"', 1)
    return svg_content

# Download each icon
def download_icons():
    successful_downloads = 0
    failed_downloads = []
    
    total_icons = len(skill_icons)
    
    print(f"Starting download of {total_icons} skill icons...")
    print("-" * 50)
    
    for i, icon in enumerate(skill_icons, 1):
        icon_name = icon["name"]
        icon_url = icon["url"]
        file_path = skills_dir / f"{icon_name}.svg"
        
        print(f"[{i}/{total_icons}] Downloading {icon_name}.svg from {icon_url}")
        
        try:
            response = requests.get(icon_url)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            # Get SVG content
            svg_content = response.text
            
            # Add color based on the icon type
            if icon_name == "aws" or icon_name == "cloudwatch" or icon_name == "codepipeline":
                svg_content = add_color_to_svg(svg_content, "#FF9900")  # AWS Orange
            elif icon_name == "azure":
                svg_content = add_color_to_svg(svg_content, "#0078D4")  # Azure Blue
            elif icon_name == "csharp":
                svg_content = add_color_to_svg(svg_content, "#239120")  # C# Green
            elif icon_name == "github-actions":
                svg_content = add_color_to_svg(svg_content, "#2088FF")  # GitHub Actions Blue
            else:
                # Add default color to make sure the icon is visible
                svg_content = add_color_to_svg(svg_content)
                
            # Save the SVG
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(svg_content)
                
            print(f"✓ Saved to {file_path}")
            successful_downloads += 1
            
        except Exception as e:
            error_msg = str(e)
            print(f"✗ Error: {error_msg}")
            failed_downloads.append({"name": icon_name, "error": error_msg})
    
    return successful_downloads, failed_downloads

if __name__ == "__main__":
    print("=== Skill Icons Downloader ===")
    
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("Error: The 'requests' library is not installed.")
        print("Please install it using: pip install requests")
        exit(1)
    
    success_count, failures = download_icons()
    total = len(skill_icons)
    
    print("\n" + "=" * 50)
    print(f"Download summary: {success_count}/{total} icons downloaded successfully")
    
    # Report failed downloads if any
    if failures:
        print(f"\nThe following {len(failures)} icons failed to download:")
        for fail in failures:
            print(f"- {fail['name']}: {fail['error']}")
        print("\nPlease check your internet connection and try again.")
    
    if success_count == total:
        print("\nAll icons downloaded successfully!")
    
    print(f"\nIcons are saved in: {skills_dir.resolve()}")