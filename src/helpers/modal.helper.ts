export function getScrollbarWidth() {
  const scrollDiv = document.createElement('div'); // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113

  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}
export function setScrollbarWidth(padding: number) {
  document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
  const fixedHeader = document.getElementById('fixed-header');
  if (fixedHeader) {
    fixedHeader.style.paddingRight = padding > 0 ? `${padding}px` : null;
  }
}

export function getOriginalBodyPadding() {
  const style = window.getComputedStyle(document.body, null);
  return parseInt(style?.getPropertyValue('padding-right') || '0', 10);
}
