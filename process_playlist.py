import json

videos = []
with open('/tmp/playlist_data.json', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line.strip())
            if data.get('title') and not data['title'].startswith('['):
                videos.append({
                    'id': data.get('id'),
                    'title': data.get('title'),
                    'url': data.get('url'),
                    'duration': data.get('duration'),
                    'duration_string': data.get('duration_string'),
                    'channel': data.get('channel'),
                    'view_count': data.get('view_count'),
                    'playlist_index': data.get('playlist_index')
                })
        except json.JSONDecodeError:
            continue

videos.sort(key=lambda x: x.get('playlist_index', 0))

output = {
    'playlist_title': 'Geopolítica',
    'playlist_id': 'PLvq3lYVuc4tZ-cj6CBgQJNv9-7oq_E0wg',
    'playlist_url': 'https://youtube.com/playlist?list=PLvq3lYVuc4tZ-cj6CBgQJNv9-7oq_E0wg',
    'total_videos': len(videos),
    'videos': videos
}

with open('playlist_geopolitica.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f'JSON creado exitosamente con {len(videos)} videos')
