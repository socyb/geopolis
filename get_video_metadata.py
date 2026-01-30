#!/usr/bin/env python3
import json
import subprocess
import sys

def get_video_metadata(video_url):
    """Obtiene metadatos de un video de YouTube usando yt-dlp"""
    try:
        # Ejecutar yt-dlp para obtener información del video en formato JSON
        result = subprocess.run(
            ['yt-dlp', '--dump-json', '--no-playlist', video_url],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parsear el JSON
        data = json.loads(result.stdout)
        
        # Extraer información relevante
        video_info = {
            'id': data.get('id'),
            'title': data.get('title'),
            'url': f"https://www.youtube.com/watch?v={data.get('id')}",
            'duration': data.get('duration'),
            'duration_string': format_duration(data.get('duration')),
            'channel': data.get('channel') or data.get('uploader'),
            'view_count': data.get('view_count', 0)
        }
        
        return video_info
        
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando yt-dlp: {e}", file=sys.stderr)
        print(f"Stderr: {e.stderr}", file=sys.stderr)
        return None
    except json.JSONDecodeError as e:
        print(f"Error parseando JSON: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error inesperado: {e}", file=sys.stderr)
        return None

def format_duration(seconds):
    """Convierte segundos a formato MM:SS o HH:MM:SS"""
    if not seconds:
        return "0:00"
    
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    else:
        return f"{minutes}:{secs:02d}"

if __name__ == "__main__":
    video_url = "https://youtu.be/DrcCTgwbsjc"
    
    print(f"Obteniendo metadatos de: {video_url}\n")
    
    metadata = get_video_metadata(video_url)
    
    if metadata:
        print("Metadatos obtenidos:")
        print(json.dumps(metadata, ensure_ascii=False, indent=2))
    else:
        print("No se pudieron obtener los metadatos")
        sys.exit(1)
