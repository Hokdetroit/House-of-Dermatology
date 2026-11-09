import { readFileSync, writeFileSync } from 'node:fs'

const file = 'public/site-assets/next/chunks/0c4vo7lg2di3r.js'
const source = readFileSync(file, 'utf8')
const start = source.indexOf('function d({playbackId:r,poster:n,preload:i,muted:s,loop:a,className:u,videoRef:c})')
const end = source.indexOf('let f=(0,o.memo)', start)
if (start < 0 || end < 0) throw new Error('Video component boundaries not found')
const replacement = `function d({playbackId:r,poster:n,preload:i,muted:s,loop:a,className:u,videoRef:c}){
const src=r?'/site-assets/videos/'+r+'.mp4':undefined;
(0,o.useEffect)(()=>{
const video=c.current;if(!video||!src)return;
let active=false,disposed=false;
const play=()=>{if(disposed||!active||document.hidden)return;video.muted=!!s;video.playsInline=true;video.play()?.catch(error=>{if(!disposed&&error.name!=='AbortError')video.controls=true})};
const playing=()=>{video.controls=false};
const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)play();else video.pause()},{rootMargin:'100px'});
observer.observe(video);video.addEventListener('canplay',play);video.addEventListener('playing',playing);document.addEventListener('visibilitychange',play);
return()=>{disposed=true;observer.disconnect();video.removeEventListener('canplay',play);video.removeEventListener('playing',playing);document.removeEventListener('visibilitychange',play)};
},[src,s]);
return(0,t.jsx)('video',{ref:c,src,poster:n,preload:i||'metadata',muted:s,loop:a,autoPlay:!!s,playsInline:true,className:u})}
`
writeFileSync(file, source.slice(0,start)+replacement+source.slice(end))
