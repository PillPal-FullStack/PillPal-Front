import React from 'react'

function LogoCircles({logoSrc="public/pillpal.png", size=260, logoSize = 48}) {
    const outerCircle = size;
    const middleCircle = size * 0.7;
    const innerCircle = size * 0.42;

    const middleOffset = (size - middleCircle) / 2;
    const innerOffset = (size - innerCircle) / 2;
  return (
    <div className="relative" style={{ width: outerCircle, height: outerCircle }}>
<style>
{`
.ring-gradient {
border: 1px solid transparent;
background-image: linear-gradient(135deg, #0ea5ff, rgba(14,165,255,0.1));
background-clip: border-box;
-webkit-mask:
linear-gradient(#fff 0 0) content-box,
linear-gradient(#fff 0 0);
-webkit-mask-composite: destination-out;
mask-composite: exclude;
}
`}
</style>

<div
className="absolute rounded-full ring-gradient"
style={{ width: outerCircle, height: outerCircle }}
></div>



<div
className="absolute rounded-full ring-gradient"
style={{ width: middleCircle, height: middleCircle, left: middleOffset, top: middleOffset }}
></div>


<div
className="absolute rounded-full ring-gradient flex items-center justify-center bg-white"
style={{ width: innerCircle, height: innerCircle, left: innerOffset, top: innerOffset }}
>
<img src={logoSrc} alt="Logo" style={{ width: logoSize, height: logoSize, objectFit: "contain" }} />
</div>
</div>
  )
}

export default LogoCircles