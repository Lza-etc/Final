export const DrawArrowHead = (context, from, to,wt=9) => {

    var dx = to[0] - from[0];
    var dy = to[1] - from[1];
    var angle = Math.atan2(dy, dx);
    var arrowLength = wt*5;
  
    context.beginPath();
    context.moveTo(to[0], to[1]);
    context.lineTo(
      to[0] - arrowLength * Math.cos(angle - Math.PI / 6),
      to[1] - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(to[0], to[1]);
    context.lineTo(
      to[0] - arrowLength * Math.cos(angle + Math.PI / 6),
      to[1] - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    context.lineWidth = 7;
    context.stroke();
    context.closePath();
  
  }