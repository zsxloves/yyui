define(["./Matrix2-d1511f33","./when-229515d6","./EllipseGeometry-4e0657ad","./RuntimeError-8f3d96ee","./ComponentDatatype-5f63ec93","./WebGLConstants-f63312fc","./GeometryOffsetAttribute-369d5efa","./Transforms-46cc38bd","./combine-6d9c3903","./EllipseGeometryLibrary-d00be24e","./GeometryAttribute-727885bb","./GeometryAttributes-b253752a","./GeometryInstance-76340cd7","./GeometryPipeline-a8cfaf59","./AttributeCompression-6b1e8028","./EncodedCartesian3-39245db5","./IndexDatatype-c2b69fc2","./IntersectionTests-65655905","./Plane-1217b5b0","./VertexFormat-af764a6f"],(function(e,t,r,n,i,o,a,s,c,d,f,l,b,m,p,y,u,G,E,C){"use strict";return function(n,i){return t.defined(i)&&(n=r.EllipseGeometry.unpack(n,i)),n._center=e.Cartesian3.clone(n._center),n._ellipsoid=e.Ellipsoid.clone(n._ellipsoid),r.EllipseGeometry.createGeometry(n)}}));