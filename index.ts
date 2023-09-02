console.clear();
import { BehaviorSubject, fromEvent, interval, merge } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';

const setElementText = (elemId, text) => 
  document.getElementById(elemId).innerText = text.toString();
const addHtmlElement = coords => document.body.innerHTML += `
  <div 
    id=${coords.id}
    style="
      position: absolute;
      height: 30px;
      width: 30px;
      text-align: center;
      top: ${coords.y}px;
      left: ${coords.x}px;
      background: silver;
      border-radius: 80%;"
    >
  </div>`;

const subject = new BehaviorSubject(0);

const click$ = fromEvent(document, 'click').pipe(
  map((e: MouseEvent) => ({ 
    x: e.clientX,
    y: e.clientY,
    id: Math.random() })),
  tap(addHtmlElement),
  mergeMap(coords =>
    subject
      .pipe(tap(v => setElementText(coords.id, v)))
  )
);

const interval$ = interval(1000).pipe(
  tap(v => subject.next(v)),
  tap(v => setElementText('intervalValue', v))
);

merge(click$, interval$).subscribe();