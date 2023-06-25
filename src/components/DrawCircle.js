const loc=sessionStorage.getItem("loc")
export const DrawCircle = (context) => {
    if(loc && x && z==slider){
          
        context.beginPath();
        
        console.log(x,y)
        context.arc(x*3.6, y*3.6, 20, 0, 2 * Math.PI);
        context.fillStyle = "blue";
        context.fill();
        context.closePath();
        
        // Draw the text
        context.font = '40px Arial';
        context.fillStyle = "red";
        context.fillText(dest, x, y+60);
        // sessionStorage.removeItem("loc");
        
      }
}

