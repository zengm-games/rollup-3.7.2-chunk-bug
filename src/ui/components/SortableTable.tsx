import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from "react-sortable-hoc";
import ResponsiveTableWrapper from "./ResponsiveTableWrapper";
import useClickable from "../hooks/useClickable";
import type { StickyCols } from "./DataTable";
import useStickyXX from "./DataTable/useStickyXX";

type HighlightHandle<Value> = (a: { index: number; value: Value }) => boolean;
type RowClassName<Value> = (a: {
	index: number;
	isDragged: boolean;
	value: Value;
}) => string | undefined;
type Row<Value> = (a: { index: number; value: Value }) => ReactNode;

// Should be Value passed through as generic parameter, but that is annoying with HOC
type ShouldBeValue = any;

const ReorderHandle = SortableHandle(
	({
		highlight,
		isDragged,
		selected,
	}: {
		highlight: boolean;
		isDragged: boolean;
		selected: boolean;
	}) => {
		return (
			<td
				className={classNames("roster-handle", {
					"table-info": !selected && highlight,
					"table-secondary": !selected && !highlight,
					"user-select-none": isDragged,
					"bg-primary": selected,
				})}
				data-movable-handle
				style={{
					cursor: isDragged ? "grabbing" : "grab",
				}}
			/>
		);
	},
);

const Row = SortableElement(
	(props: {
		className?: string;
		disabled2?: boolean;
		highlight: boolean;
		i: number;
		isDragged: boolean;
		selected: boolean;
		row: Row<ShouldBeValue>;
		rowLabel?: string;
		value: ShouldBeValue;
	}) => {
		const { clicked, toggleClicked } = useClickable();

		const {
			className,
			disabled2,
			highlight,
			i,
			isDragged,
			row,
			rowLabel,
			selected,
			value,
		} = props;

		return (
			<tr
				className={classNames(className, {
					"table-warning": clicked,
				})}
				onClick={toggleClicked}
			>
				{rowLabel !== undefined ? (
					<td className="text-center">{rowLabel}</td>
				) : null}
				{disabled2 ? (
					<td className="p-0" />
				) : (
					<ReorderHandle
						highlight={highlight}
						isDragged={isDragged}
						selected={selected}
					/>
				)}
				{row({
					index: i,
					value,
				})}
			</tr>
		);
	},
);

const TBody = SortableContainer(
	({
		disabled,
		highlightHandle,
		indexSelected,
		isDragged,
		row,
		rowClassName,
		rowLabels,
		values,
	}: {
		disabled?: boolean;
		highlightHandle: HighlightHandle<ShouldBeValue>;
		indexSelected: number | undefined;
		isDragged: boolean;
		row: ShouldBeValue;
		rowClassName?: RowClassName<ShouldBeValue>;
		rowLabels?: string[];
		values: ShouldBeValue[];
	}) => {
		return (
			<tbody>
				{values.map((value, index) => {
					const className: string | undefined = rowClassName
						? rowClassName({ index, isDragged, value })
						: undefined;
					const highlight = highlightHandle({ index, value });

					// Hacky! Would be better to pass in explicitly. If `index` is just used, then it breaks highlighting (highlight doesn't move with row when dragged)
					let key;
					if (Object.hasOwn(value, "pid")) {
						key = value.pid;
					} else if (Object.hasOwn(value, "tid")) {
						key = value.tid;
					} else {
						key = index;
					}

					return (
						<Row
							className={className}
							disabled2={disabled}
							key={key}
							highlight={highlight}
							i={index}
							index={index}
							isDragged={isDragged}
							selected={indexSelected === index}
							rowLabel={rowLabels ? rowLabels[index] ?? "" : undefined}
							row={row}
							value={value}
						/>
					);
				})}
			</tbody>
		);
	},
);

const SortableTable = <Value extends Record<string, unknown>>({
	cols,
	disabled,
	highlightHandle,
	onChange,
	onSwap,
	row,
	rowClassName,
	rowLabels,
	stickyCols = 0,
	values,
}: {
	cols: () => ReactNode;
	disabled?: boolean;
	highlightHandle: HighlightHandle<Value>;
	onChange: (a: { oldIndex: number; newIndex: number }) => void;
	onSwap: (index1: number, index2: number) => void;
	row: Row<Value>;
	rowClassName?: RowClassName<Value>;
	rowLabels?: string[];
	stickyCols?: StickyCols;
	values: Value[];
}) => {
	const [isDragged, setIsDragged] = useState(false);
	const [indexSelected, setIndexSelected] = useState<number | undefined>(
		undefined,
	);

	const { stickyClass, tableRef } = useStickyXX(stickyCols);

	// Hacky shit to try to determine click from drag. Could just be a boolean, except on mobile seems sorting fires twice in a row, so we need to track the time to debounce.
	const clicked = useRef<{
		index: number | undefined;
		time: number; // Milliseconds
	}>({
		index: undefined,
		time: 0,
	});

	const onSortStart = useCallback(
		({ node, index }: { node: Element; index: number }) => {
			setIsDragged(true);

			// Hack to avoid responding to duiplicated event on mobile
			const ignoreToDebounce = Date.now() - clicked.current.time < 500;
			if (!ignoreToDebounce) {
				clicked.current.index = index;
			}

			// https://github.com/clauderic/react-sortable-hoc/issues/361#issuecomment-471907612
			const tds =
				document.getElementsByClassName("SortableHelper")[0].childNodes;
			for (let i = 0; i < tds.length; i++) {
				const childNode = node.childNodes[i];
				// @ts-expect-error
				tds[i].style.width = `${childNode.offsetWidth}px`;
				// @ts-expect-error
				tds[i].style.padding = "4px";
			}
		},
		[],
	);

	const onSortOver = useCallback(() => {
		clicked.current.index = undefined;
	}, []);

	const onSortEnd = useCallback(
		({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
			setIsDragged(false);

			// Hack to avoid responding to duiplicated event on mobile
			const ignoreToDebounce = Date.now() - clicked.current.time < 500;
			if (ignoreToDebounce) {
				return;
			}
			clicked.current.time = Date.now();

			if (oldIndex === newIndex && clicked.current.index === newIndex) {
				if (indexSelected === undefined) {
					setIndexSelected(newIndex);
				} else if (indexSelected === newIndex) {
					// Hack to avoid responding to duiplicated event on mobile
					if (!ignoreToDebounce) {
						setIndexSelected(undefined);
					}
				} else {
					onSwap(indexSelected, newIndex);
					setIndexSelected(undefined);
				}
			} else {
				onChange({ oldIndex, newIndex });
				setIndexSelected(undefined);
			}
			clicked.current.index = undefined;
		},
		[onChange, onSwap, indexSelected],
	);

	let tableClasses =
		"table table-striped table-borderless table-sm table-hover";
	if (stickyClass) {
		tableClasses += ` ${stickyClass}`;
	}

	return (
		<ResponsiveTableWrapper nonfluid>
			<table ref={tableRef} className={tableClasses}>
				<thead>
					<tr>
						<th className="p-0" />
						{rowLabels ? <th className="p-0" /> : null}
						{cols()}
					</tr>
				</thead>
				<TBody
					disabled={disabled}
					helperClass="SortableHelper"
					highlightHandle={highlightHandle}
					indexSelected={indexSelected}
					isDragged={isDragged}
					onSortEnd={onSortEnd}
					onSortStart={onSortStart}
					onSortOver={onSortOver}
					row={row}
					rowClassName={rowClassName}
					rowLabels={rowLabels}
					transitionDuration={0}
					values={values}
					useDragHandle
				/>
			</table>
		</ResponsiveTableWrapper>
	);
};

export default SortableTable;
