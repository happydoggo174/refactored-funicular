import requests
with open('libs/dompurify 3.3.1','wb') as fp:
    fp.write(requests.get('https://cdn.jsdelivr.net/npm/dompurify@3.3.1/dist/purify.min.js/+esm').content)