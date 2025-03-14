import os
import requests
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Choose where to save the icons
skills_dir = Path("../public/images/skills")
skills_dir.mkdir(parents=True, exist_ok=True)

print(f"Target directory: {skills_dir.resolve()}")

# List of skills with their URLs and proper colors
skill_icons = [
    # Core cloud platforms
    {"name": "aws", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg", "color": "000000"},
    {"name": "azure", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftazure.svg", "color": "000000"},
    {"name": "gcp", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/googlecloud.svg", "color": "000000"},
    
    # Programming languages
    {"name": "python", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/python.svg", "color": "000000"},
    {"name": "typescript", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/typescript.svg", "color": "000000"},
    {"name": "javascript", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/javascript.svg", "color": "000000"},
    {"name": "bash", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gnubash.svg", "color": "000000"},
    {"name": "java", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/openjdk.svg", "color": "000000"},
    {"name": "csharp", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/csharp.svg", "color": "000000"},
    
    # Frontend & Web Frameworks
    {"name": "nextjs", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/nextdotjs.svg", "color": "000000"},
    {"name": "flask", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/flask.svg", "color": "000000"},
    {"name": "fastapi", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/fastapi.svg", "color": "000000"},
    {"name": "angular", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/angular.svg", "color": "000000"},
    {"name": "tailwind", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/tailwindcss.svg", "color": "000000"},
    
    # Infrastructure & IaC tools
    {"name": "terraform", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/terraform.svg", "color": "000000"},
    {"name": "pulumi", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/pulumi.svg", "color": "000000"},
    {"name": "cloudformation", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg", "color": "000000"},
    {"name": "docker", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/docker.svg", "color": "000000"},
    {"name": "kubernetes", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/kubernetes.svg", "color": "000000"},
    {"name": "vagrant", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/vagrant.svg", "color": "000000"},
    {"name": "packer", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/packer.svg", "color": "000000"},
    
    # Configuration Management
    {"name": "ansible", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/ansible.svg", "color": "000000"},
    {"name": "chef", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/chef.svg", "color": "000000"},
    {"name": "puppet", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/puppet.svg", "color": "000000"},
    
    # Operating Systems
    {"name": "linux", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/linux.svg", "color": "000000"},
    
    # Monitoring & Observability
    {"name": "newrelic", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/newrelic.svg", "color": "000000"},
    {"name": "prometheus", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/prometheus.svg", "color": "000000"},
    {"name": "datadog", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/datadog.svg", "color": "000000"},
    {"name": "cloudwatch", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg", "color": "000000"},
    {"name": "splunk", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/splunk.svg", "color": "000000"},
    {"name": "grafana", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/grafana.svg", "color": "000000"},
    {"name": "opensearch", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/opensearch.svg", "color": "000000"},
    {"name": "elasticsearch", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/elasticsearch.svg", "color": "000000"},
    
    # CI/CD tools
    {"name": "github-actions", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/githubactions.svg", "color": "000000"},
    {"name": "gitops", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/git.svg", "color": "000000"},
    {"name": "argocd", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/argo.svg", "color": "000000"},
    {"name": "bitbucket", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/bitbucket.svg", "color": "000000"},
    {"name": "codepipeline", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg", "color": "000000"},
    {"name": "jenkins", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/jenkins.svg", "color": "000000"},

    # Socials
    {"name": "strava", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/strava.svg", "color": "000000"},
    {"name": "github", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/github.svg", "color": "000000"},
    {"name": "linkedin", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/linkedin.svg", "color": "000000"},

    # AWS Services
    {"name": "ecs", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonecs.svg", "color": "000000"},
    {"name": "cloudwatch", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazoncloudwatch.svg", "color": "000000"},
    {"name": "s3", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazons3.svg", "color": "000000"},

    # Random
    {"name": "reddit", "url": "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/reddit.svg", "color": "000000"},
]

# Create custom SVG for problematic icons that don't have good simple-icons
custom_svgs = {
    "codepipeline": """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M8.954 20.574a1.4 1.4 0 01-1.401-1.4v-1.865H7.14a2.8 2.8 0 01-2.8-2.8V8.921a2.8 2.8 0 012.8-2.8h9.72a2.8 2.8 0 012.8 2.8v5.588a2.8 2.8 0 01-2.8 2.8h-.412v1.865a1.4 1.4 0 01-1.401 1.4zm-.467-12.52v9.255h7.028V8.054zM16.86 12.642h.58v1.866h-.58zM6.56 12.642h.58v1.866h-.58z"/>
        <path d="M10.355 4.626v2.8h3.29v-2.8z"/>
    </svg>
    """,
    "cloudformation": """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M13.33 9.13c0 .1-.01.19-.03.26a.37.37 0 01-.2.22c-.07.03-.17.04-.29.04h-.54v-1.06h.55c.11 0 .2.01.27.04.07.02.13.07.18.15.05.08.07.18.07.34zm5.77.23c0 .14-.01.24-.04.31-.02.06-.05.12-.09.16-.04.04-.1.07-.17.09-.07.02-.16.03-.28.03h-.48V8.92h.43c.15 0 .26.01.34.03.08.02.14.05.18.09.04.04.07.1.09.18.02.07.02.16.02.28v.01zm-20.12.45h9.21v1.57H-1.02zm10.01 4.4h9.21v1.56H8.99zm-3.6-2.17h6.77v1.56H5.39zm16.18-4.4h.48c.12 0 .21.01.28.04.07.02.13.07.17.13.05.06.07.16.07.28 0 .08-.01.15-.03.2-.02.06-.05.1-.1.14a.46.46 0 01-.3.1h-.56zm-14.72.23c0 .2-.04.35-.1.46-.06.11-.18.2-.34.25l.54.9h-.6l-.47-.83h-.19v.83h-.5V9.11h.87c.16 0 .28.01.38.03.1.02.18.06.25.11.07.05.12.13.15.22.04.09.05.2.05.34zM-1.02 2v1.57h9.21v4.39h1.6V-1.69H-2.61V2zm0 20h9.21v1.57h1.6v-7.57h-1.6v4.43H-2.61V22zm23.59-5.79v7.79h-9.21v-1.57h-1.6v7.57h2.2c.62 0 1.04-.42 1.04-1.04v-11.15c0-.21.02-.37.05-.48.04-.12.1-.2.2-.25.09-.06.22-.09.4-.09h6.92zM24.2.27v10.92h-1.63V7.35h-9.18V5.78h9.18V1.3h-8.14V-.26h8.14c.62 0 1.04.42 1.04 1.04v20.73h-8.57v1.57h8.57v4.92H-2.61v-4.92h9.2v-1.57h-9.2V1.3H6.6V-.26H-2.61c-.63 0-1.04.42-1.04 1.04v26.44c0 .62.41 1.04 1.04 1.04h26.77c.62 0 1.04-.42 1.04-1.04V.27zm-17.14 12.41h-.63v-.83h.6c.13 0 .22.01.28.04.06.03.1.07.13.13.02.06.04.12.04.2 0 .06-.01.11-.02.16a.32.32 0 01-.13.17c-.06.04-.15.07-.27.07z"/>
    </svg>
    """
}

def standardize_svg(svg_content, color="#000000"):
    """Standardize SVG to ensure consistent appearance and proper fill color with bold effect."""
    try:
        # Try parsing with ElementTree first
        root = ET.fromstring(svg_content)
        
        # Set viewBox if it doesn't exist
        if 'viewBox' not in root.attrib:
            if 'width' in root.attrib and 'height' in root.attrib:
                width = root.attrib.get('width', '24')
                height = root.attrib.get('height', '24')
                # Remove px if present
                width = width.replace('px', '')
                height = height.replace('px', '')
                try:
                    width = float(width)
                    height = float(height)
                    root.attrib['viewBox'] = f"0 0 {width} {height}"
                except ValueError:
                    root.attrib['viewBox'] = "0 0 24 24"
            else:
                root.attrib['viewBox'] = "0 0 24 24"
        
        # Remove width and height attributes to make it scale properly
        if 'width' in root.attrib:
            del root.attrib['width']
        if 'height' in root.attrib:
            del root.attrib['height']
        
        # Calculate slightly smaller viewBox to make paths appear thicker/bolder
        if 'viewBox' in root.attrib:
            try:
                viewBox = root.attrib['viewBox'].split()
                if len(viewBox) == 4:  # Ensure viewBox has 4 components (x, y, width, height)
                    # Expand the viewBox slightly to create margin
                    x, y, w, h = map(float, viewBox)
                    padding = min(w, h) * 0.05  # 5% padding for bolder appearance
                    
                    # Apply a slight transformation to make the paths appear bolder
                    root.attrib['viewBox'] = f"{x - padding} {y - padding} {w + padding*2} {h + padding*2}"
                    
                    # Add a transform to scale up the content slightly
                    transform_attr = f"scale(1.05)"
                    
                    # Find or create a group element to apply the transform
                    found_g = False
                    for child in root:
                        if child.tag.split('}')[-1] == 'g':
                            child.attrib['transform'] = transform_attr
                            found_g = True
                            break
                    
                    if not found_g and len(list(root)) > 0:
                        # Create a new group element
                        ns = root.tag.split('}')[0] + '}' if '}' in root.tag else ''
                        g = ET.Element(f"{ns}g", attrib={'transform': transform_attr})
                        
                        # Move all children to the new group
                        children = list(root)
                        for child in children:
                            root.remove(child)
                            g.append(child)
                        
                        root.append(g)
            except Exception as e:
                print(f"Warning: Could not adjust viewBox for bolder effect: {e}")
            
        # Apply fill color to all path, polygon, rect, circle elements
        for element in root.iter():
            tag_name = element.tag.split('}')[-1]
            if tag_name in ['path', 'polygon', 'rect', 'circle', 'ellipse']:
                element.attrib['fill'] = color
                
                # Add stroke for bolder appearance
                element.attrib['stroke'] = color
                element.attrib['stroke-width'] = '0.5'
                
                # Apply non-scaling stroke to maintain consistent thickness
                element.attrib['vector-effect'] = 'non-scaling-stroke'
        
        # Convert back to string with pretty print
        rough_string = ET.tostring(root, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        pretty_svg = reparsed.toprettyxml(indent="  ")
        
        # Clean up the XML declaration and empty lines
        pretty_svg = '\n'.join([line for line in pretty_svg.split('\n') if line.strip()])
        if pretty_svg.startswith('<?xml'):
            pretty_svg = '\n'.join(pretty_svg.split('\n')[1:])
            
        return pretty_svg
        
    except Exception as e:
        print(f"ElementTree parsing failed: {e}")
        # Fallback to regex-based approach
        try:
            # Add viewBox if missing
            if 'viewBox' not in svg_content:
                svg_content = svg_content.replace('<svg', '<svg viewBox="0 0 24 24"')
            
            # Remove width and height
            svg_content = re.sub(r'width="[^"]+"', '', svg_content)
            svg_content = re.sub(r'height="[^"]+"', '', svg_content)
            
            # Add fill and stroke to paths if missing (for bolder appearance)
            svg_content = re.sub(r'<(path|polygon|rect|circle|ellipse)([^>]+)(?!fill=)', 
                                 f'<\\1\\2 fill="{color}" stroke="{color}" stroke-width="0.5" vector-effect="non-scaling-stroke"', svg_content)
            
            # Replace existing fills and add stroke
            svg_content = re.sub(r'fill="[^"]+"', f'fill="{color}"', svg_content)
            
            # Add stroke attributes if they don't exist
            svg_content = re.sub(r'<(path|polygon|rect|circle|ellipse)([^>]+)(?!stroke=)', 
                                 f'<\\1\\2 stroke="{color}" stroke-width="0.5" vector-effect="non-scaling-stroke"', svg_content)
            
            return svg_content
        except Exception as e:
            print(f"Regex approach also failed: {e}")
            return svg_content

def download_and_standardize_icons():
    successful_downloads = 0
    failed_downloads = []
    
    total_icons = len(skill_icons)
    
    print(f"Starting download and standardization of {total_icons} skill icons...")
    print("-" * 50)
    
    for i, icon in enumerate(skill_icons, 1):
        icon_name = icon["name"]
        icon_url = icon["url"]
        icon_color = icon["color"]
        file_path = skills_dir / f"{icon_name}.svg"
        
        print(f"[{i}/{total_icons}] Processing {icon_name}.svg")
        
        try:
            # Check if we have a custom SVG for this icon
            if icon_name in custom_svgs:
                svg_content = custom_svgs[icon_name]
                print(f"Using custom SVG for {icon_name}")
            else:
                # Download the icon
                response = requests.get(icon_url)
                response.raise_for_status()
                svg_content = response.text
                print(f"Downloaded {icon_name} from {icon_url}")
            
            # Standardize the SVG
            standardized_svg = standardize_svg(svg_content, icon_color)
            
            # Save the standardized SVG
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(standardized_svg)
                
            print(f"✓ Saved standardized SVG to {file_path}")
            successful_downloads += 1
            
        except Exception as e:
            error_msg = str(e)
            print(f"✗ Error processing {icon_name}: {error_msg}")
            failed_downloads.append({"name": icon_name, "error": error_msg})
    
    return successful_downloads, failed_downloads

if __name__ == "__main__":
    print("=== SVG Icon Downloader and Standardizer ===")
    
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("Error: The 'requests' library is not installed.")
        print("Please install it using: pip install requests")
        exit(1)
    
    success_count, failures = download_and_standardize_icons()
    total = len(skill_icons)
    
    print("\n" + "=" * 50)
    print(f"Processing summary: {success_count}/{total} icons processed successfully")
    
    # Report failed downloads if any
    if failures:
        print(f"\nThe following {len(failures)} icons failed to process:")
        for fail in failures:
            print(f"- {fail['name']}: {fail['error']}")
    
    if success_count == total:
        print("\nAll icons processed successfully!")
    
    print(f"\nIcons are saved in: {skills_dir.resolve()}")