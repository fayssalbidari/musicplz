import { TextAnimator } from 'https://cdn.jsdelivr.net/gh/fayssalbidari/musicplz@7850771/text-animator.js';

const init = () => {
  document.querySelectorAll('.list__item').forEach(item => {
    const cols = Array.from(item.querySelectorAll('.hover-effect'));
    const animators = cols.map(col => new TextAnimator(col));

    item.addEventListener('mouseenter', () => {
      animators.forEach(animator => animator.animate());
    });
  });

  // Same for all links
  document.querySelectorAll('a.hover-effect').forEach(item => {
    const animator = new TextAnimator(item);
    item.addEventListener('mouseenter', () => {
      animator.animate();
    });
  });
};

init();
