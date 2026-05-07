/*
 * Render a simple Minecraft-style isometric block using three textures:
 * top, left, and right.
 */

/**
 * Loads an image from the given source URL.
 * 
 * @param {string} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image.
 */
function loadImage(src) {
	return new Promise((resolve, reject) => {
		if (!src || typeof src !== "string") {
			reject(new Error("Image source must be a non-empty string."));
			return;
		}

		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
		img.src = src;
	});
}

/**
 * Solves the affine transformation matrix that maps the source triangle to the destination triangle.
 * 
 * @param {Array<{x: number, y: number}>} srcTri - The source triangle vertices.
 * @param {Array<{x: number, y: number}>} dstTri - The destination triangle vertices.
 * @returns {{a: number, b: number, c: number, d: number, e: number, f: number} | null} The affine transformation matrix or null if not solvable.
 */
function solveAffineTransform(srcTri, dstTri) {
	const x0 = srcTri[0].x;
	const y0 = srcTri[0].y;
	const x1 = srcTri[1].x;
	const y1 = srcTri[1].y;
	const x2 = srcTri[2].x;
	const y2 = srcTri[2].y;

	const u0 = dstTri[0].x;
	const v0 = dstTri[0].y;
	const u1 = dstTri[1].x;
	const v1 = dstTri[1].y;
	const u2 = dstTri[2].x;
	const v2 = dstTri[2].y;

	const det = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
	if (Math.abs(det) < 1e-10) {
		return null;
	}

	const a = (u0 * (y1 - y2) + u1 * (y2 - y0) + u2 * (y0 - y1)) / det;
	const b = (v0 * (y1 - y2) + v1 * (y2 - y0) + v2 * (y0 - y1)) / det;
	const c = (u0 * (x2 - x1) + u1 * (x0 - x2) + u2 * (x1 - x0)) / det;
	const d = (v0 * (x2 - x1) + v1 * (x0 - x2) + v2 * (x1 - x0)) / det;
	const e =
		(u0 * (x1 * y2 - x2 * y1) + u1 * (x2 * y0 - x0 * y2) + u2 * (x0 * y1 - x1 * y0)) /
		det;
	const f =
		(v0 * (x1 * y2 - x2 * y1) + v1 * (x2 * y0 - x0 * y2) + v2 * (x0 * y1 - x1 * y0)) /
		det;

	return { a, b, c, d, e, f };
}

/**
 * Draws an image mapped to a triangle on the canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
 * @param {HTMLImageElement} image - The image to draw.
 * @param {Array<{x: number, y: number}>} srcTri - The source triangle vertices.
 * @param {Array<{x: number, y: number}>} dstTri - The destination triangle vertices.
 */
function drawImageToTriangle(ctx, image, srcTri, dstTri) {
	const matrix = solveAffineTransform(srcTri, dstTri);
	if (!matrix) {
		return;
	}

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(dstTri[0].x, dstTri[0].y);
	ctx.lineTo(dstTri[1].x, dstTri[1].y);
	ctx.lineTo(dstTri[2].x, dstTri[2].y);
	ctx.closePath();
	ctx.clip();
	ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, 0, 0);
	ctx.restore();
}

/**
 * Draws a path connecting the given points.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
 * @param {Array<{x: number, y: number}>} points - The points to connect.
 */
function drawQuadPath(ctx, points) {
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i += 1) {
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
}

/**
 * Fills a quadrilateral with the specified color.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
 * @param {Array<{x: number, y: number}>} points - The quadrilateral vertices.
 * @param {string} color - The fill color.
 */
function fillQuad(ctx, points, color) {
	ctx.save();
	drawQuadPath(ctx, points);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

/**
 * Draws a textured quadrilateral on the canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
 * @param {HTMLImageElement} image - The image to draw.
 * @param {Array<{x: number, y: number}>} points - The quadrilateral vertices.
 */
function drawTexturedQuad(ctx, image, points) {
	if (!points || points.length !== 4) {
		return;
	}

	const w = image.width;
	const h = image.height;
	const srcTri = [
		{ x: 0, y: 0 },
		{ x: w, y: 0 },
		{ x: 0, y: h },
	];
	const dstTri = [points[0], points[1], points[3]];
	const matrix = solveAffineTransform(srcTri, dstTri);
	if (!matrix) {
		return;
	}

	ctx.save();
	drawQuadPath(ctx, points);
	ctx.clip();
	ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, 0, 0);
	ctx.restore();

	ctx.save();
	drawQuadPath(ctx, points);
	ctx.clip();
	ctx.globalCompositeOperation = "multiply";
	ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
	ctx.fill();
	ctx.restore();
}

/**
 * Renders a Minecraft-style block on the given canvas.
 * 
 * @param {Object} options - The rendering options.
 * @param {HTMLCanvasElement} options.canvas - The canvas element to render on.
 * @param {string} [options.topSrc] - The source URL for the top texture.
 * @param {string} [options.leftSrc] - The source URL for the left texture.
 * @param {string} [options.rightSrc] - The source URL for the right texture.
 * @param {number} [options.size=180] - The size of the block.
 * @param {number} [options.blockHeight=110] - The height of the block.
 * @param {number} [options.padding=20] - The padding around the block.
 * @param {string} [options.clearColor=null] - The color to clear the canvas with.
 * @param {string} [options.fallbackTopColor="#bdbdbd"] - The fallback color for the top face.
 * @param {string} [options.fallbackLeftColor="#9f9f9f"] - The fallback color for the left face.
 * @param {string} [options.fallbackRightColor="#8a8a8a"] - The fallback color for the right face.
 * @returns {Promise<void>} A promise that resolves when rendering is complete.
 */
async function renderMinecraftBlock(options) {
	const {
		canvas,
		topSrc,
		leftSrc,
		rightSrc,
		size = 180,
		blockHeight = 110,
		padding = 20,
		clearColor = null,
		fallbackTopColor = "#bdbdbd",
		fallbackLeftColor = "#9f9f9f",
		fallbackRightColor = "#8a8a8a",
	} = options || {};

	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("options.canvas must be an HTMLCanvasElement.");
	}

	const loadOrNull = async (src) => {
		if (!src || typeof src !== "string") {
			return null;
		}
		try {
			return await loadImage(src);
		} catch {
			return null;
		}
	};

	const [topImg, leftImg, rightImg] = await Promise.all([
		loadOrNull(topSrc),
		loadOrNull(leftSrc),
		loadOrNull(rightSrc),
	]);

	const halfWidth = size / 2;
	const depth = size / 4;

	const canvasWidth = Math.ceil(size + padding * 2);
	const canvasHeight = Math.ceil(depth * 2 + blockHeight + padding * 2);
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to acquire 2D rendering context.");
	}

	if (clearColor) {
		ctx.fillStyle = clearColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	const cx = canvas.width / 2;
	const topY = padding;

	const back = { x: cx, y: topY };
	const right = { x: cx + halfWidth, y: topY + depth };
	const front = { x: cx, y: topY + depth * 2 };
	const left = { x: cx - halfWidth, y: topY + depth };

	const frontDown = { x: front.x, y: front.y + blockHeight };
	const leftDown = { x: left.x, y: left.y + blockHeight };
	const rightDown = { x: right.x, y: right.y + blockHeight };

	const topFace = [front, right, back, left];
	const leftFace = [front, left, leftDown, frontDown];
	const rightFace = [frontDown, rightDown, right, front];

	if (topImg) {
		drawTexturedQuad(ctx, topImg, topFace);
	} else {
		fillQuad(ctx, topFace, fallbackTopColor);
	}

	if (leftImg) {
		drawTexturedQuad(ctx, leftImg, leftFace);
	} else {
		fillQuad(ctx, leftFace, fallbackLeftColor);
	}

	if (rightImg) {
		drawTexturedQuad(ctx, rightImg, rightFace);
	} else {
		fillQuad(ctx, rightFace, fallbackRightColor);
	}

	// Subtle edge lines help define shape boundaries.
	ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
	ctx.lineWidth = 1;

	[topFace, leftFace, rightFace].forEach((face) => {
		ctx.beginPath();
		ctx.moveTo(face[0].x, face[0].y);
		for (let i = 1; i < face.length; i += 1) {
			ctx.lineTo(face[i].x, face[i].y);
		}
		ctx.closePath();
		ctx.stroke();
	});
}

/**
 * Binds a Minecraft-style block renderer to an HTML canvas element.
 * 
 * @param {*} config - The configuration options for the block renderer.
 * @returns {Object} An object with a `render` method to render the block.
 */
function bindBlockRendererFromHtml(config) {
	const {
		canvasSelector = "#blockCanvas",
		topSrc = "",
		leftSrc = "",
		rightSrc = "",
		size = 180,
		blockHeight = 110,
		fallbackTopColor = "#bdbdbd",
		fallbackLeftColor = "#9f9f9f",
		fallbackRightColor = "#8a8a8a",
	} = config || {};

	const canvas = document.querySelector(canvasSelector);

	if (!canvas) {
		throw new Error("Could not find required canvas element for block renderer.");
	}

	const render = async () => {
		const fixedSize = Number.isFinite(size) && size > 0 ? size : 180;
		const fixedHeight = Number.isFinite(blockHeight) && blockHeight > 0 ? blockHeight : 110;

		try {
			await renderMinecraftBlock({
				canvas,
				topSrc,
				leftSrc,
				rightSrc,
				size: fixedSize,
				blockHeight: fixedHeight,
				fallbackTopColor,
				fallbackLeftColor,
				fallbackRightColor,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return { render };
}

if (typeof window !== "undefined") {
	window.renderMinecraftBlock = renderMinecraftBlock;
	window.bindBlockRendererFromHtml = bindBlockRendererFromHtml;
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		renderMinecraftBlock,
		bindBlockRendererFromHtml,
	};
}
