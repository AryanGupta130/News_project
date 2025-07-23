from typing import List, Dict
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class NewsServices:
    def __init__(self):
        self.api_key = os.getenv('NEWS_API_KEY')
        self.base_url = 'https://newsapi.org/v2'
        self.cache = {}
        self.cache_duration = timedelta(minutes=30)

    def get_news_for_preferences(self, preferences: str) -> List[Dict]:
        cache_key = f"{preferences}_{datetime.now().strftime('%Y-%m-%d-%H')}"
        
        # Check cache first
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if datetime.now() - cached_data['timestamp'] < self.cache_duration:
                return cached_data['articles']

        try:
            # Make API request to NewsAPI
            response = requests.get(
                self.base_url,
                params={
                    'q': preferences,
                    'sortBy': 'publishedAt',
                    'language': 'en',
                    'pageSize': 10,
                    'apiKey': self.api_key
                }
            )
            
            if response.status_code == 200:
                articles = response.json()['articles']
                
                # Cache the results
                self.cache[cache_key] = {
                    'timestamp': datetime.now(),
                    'articles': articles
                }
                
                return articles
            else:
                print(f"Error fetching news: {response.status_code}")
                return []

        except Exception as e:
            print(f"Error in news service: {e}")
            return []