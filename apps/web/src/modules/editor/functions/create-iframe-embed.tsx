import { type BlockNoteEditor, insertOrUpdateBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Code } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const createIframeEmbed = createReactBlockSpec(
	{
		type: "iframe",
		propSchema: {
			url: {
				default: "" as const,
			},
			previewWidth: {
				default: 0 as const,
			},
			previewHeight: {
				default: 0 as const,
			},
		},
		content: "none",
	},
	{
		render(props) {
			const { url, previewWidth, previewHeight } = props.block.props;
			const editor = props.editor;
			const wrapperRef = useRef<HTMLDivElement | null>(null);
			const [resizing, setResizing] = useState<boolean>(false);
			const [width, setWidth] = useState<number | null>(
				typeof previewWidth === "number" && previewWidth > 0
					? previewWidth
					: null,
			);
			const [height, setHeight] = useState<number>(
				typeof previewHeight === "number" && previewHeight > 0
					? previewHeight
					: 300,
			);
			const resizeParamsRef = useRef<{
				initialWidth: number;
				initialHeight: number;
				initialClientX: number;
				initialClientY: number;
			} | null>(null);

			useEffect(() => {
				if (!resizing) return;

				const onMove = (event: MouseEvent | TouchEvent) => {
					const clientX =
						"touches" in event ? event.touches[0].clientX : event.clientX;
					const clientY =
						"touches" in event ? event.touches[0].clientY : event.clientY;
					const params = resizeParamsRef.current;
					const wrapper = wrapperRef.current;
					if (!params || !wrapper) return;

					let newWidth =
						params.initialWidth + (clientX - params.initialClientX);
					let newHeight =
						params.initialHeight + (clientY - params.initialClientY);

					const minWidth = 64;
					const minHeight = 64;
					const maxWidth =
						editor?.domElement?.firstElementChild?.clientWidth ||
						wrapper.parentElement?.clientWidth ||
						Number.MAX_VALUE;
					const maxHeight =
						editor?.domElement?.firstElementChild?.clientHeight ||
						wrapper.parentElement?.clientHeight ||
						Number.MAX_VALUE;

					newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
					newHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
					setWidth(newWidth);
					setHeight(newHeight);
				};

				const onUp = (event: MouseEvent | TouchEvent) => {
					setResizing(false);
					resizeParamsRef.current = null;

					if (typeof width === "number" && width > 0) {
						editor.updateBlock(props.block, {
							props: {
								previewWidth: width,
								previewHeight: height,
							},
						});
					}
				};

				window.addEventListener("mousemove", onMove);
				window.addEventListener("touchmove", onMove, { passive: true });
				window.addEventListener("mouseup", onUp);
				window.addEventListener("touchend", onUp);

				return () => {
					window.removeEventListener("mousemove", onMove);
					window.removeEventListener("touchmove", onMove);
					window.removeEventListener("mouseup", onUp);
					window.removeEventListener("touchend", onUp);
				};
			}, [resizing, editor, props.block, width, height]);

			const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
				event.preventDefault();
				const wrapper = wrapperRef.current;
				if (!wrapper) return;

				const clientX =
					"touches" in event
						? (event as React.TouchEvent).touches[0].clientX
						: (event as React.MouseEvent).clientX;
				const clientY =
					"touches" in event
						? (event as React.TouchEvent).touches[0].clientY
						: (event as React.MouseEvent).clientY;

				resizeParamsRef.current = {
					initialWidth: wrapper.clientWidth,
					initialHeight: wrapper.clientHeight,
					initialClientX: clientX,
					initialClientY: clientY,
				};
				setResizing(true);
			};

			const showHandles = !!editor?.isEditable;

			return (
				<div
					ref={wrapperRef}
					style={{
						position: "relative",
						width:
							typeof width === "number" && width > 0 ? `${width}px` : "100%",
						height: `${height}px`,
					}}
				>
					{resizing && (
						<div
							style={{
								position: "absolute",
								inset: 0,
								zIndex: 1,
								background: "transparent",
							}}
						/>
					)}

					<iframe
						style={{
							width: "100%",
							height: "100%",
							display: "block",
							border: 0,
						}}
						src={url}
						title={url}
						allowFullScreen={true}
					/>

					{showHandles && (
						<button
							type="button"
							className="bn-resize-handle"
							style={{
								position: "absolute",
								bottom: "4px",
								right: "4px",
								width: "12px",
								height: "12px",
								cursor: "nwse-resize",
								zIndex: 2,
								background: "transparent",
								borderRadius: "2px",
								padding: 0,
							}}
							onMouseDown={handleMouseDown}
							onTouchStart={handleMouseDown}
						/>
					)}
				</div>
			);
		},
	},
);

// Custom Slash Menu item to insert a block after the current one.
export const insertIframe = (editor: BlockNoteEditor<any, any, any>) => ({
	title: "Insert Iframe",
	onItemClick: () => {
		const url = window.prompt("URL");

		if (url) {
			insertOrUpdateBlock(editor, {
				type: "iframe",
				props: {
					url,
				},
			});
		}
	},
	aliases: ["iframe"],
	group: "Other",
	icon: <Code size={18} />,
	subtext: "Used to insert a block with iframe.",
});
