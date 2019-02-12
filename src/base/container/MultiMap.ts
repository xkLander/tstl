//================================================================ 
/** @module std.base */
//================================================================
import { MapContainer } from "./MapContainer";
import { MapIterator } from "../iterator/MapIterator";

import { IForwardIterator } from "../../iterator/IForwardIterator";
import { IPair } from "../../utility/IPair";

/**
 * Base class for Multiple-key Map Containers.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export abstract class MultiMap<Key, T, Source extends MultiMap<Key, T, Source>>
	extends MapContainer<Key, T, false, Source>
{
	/* ---------------------------------------------------------
		INSERT
	--------------------------------------------------------- */
	/**
	 * Construct and insert an element.
	 * 
	 * @param key Key to be mapped.
	 * @param value Value to emplace.
	 * @return An iterator to the newly inserted element.
	 */
	public abstract emplace(key: Key, value: T): MapIterator<Key, T, false, Source>;

	/**
	 * Construct and insert element with hint.
	 * 
	 * @param hint Hint for the position where the element can be inserted.
	 * @param key Key of the new element.
	 * @param val Value of the new element.
	 * @return An iterator to the newly inserted element.
	 */
	public abstract emplace_hint(hint: MapIterator<Key, T, false, Source>, key: Key, val: T): MapIterator<Key, T, false, Source>;

	/**
	 * Insert an element.
	 * 
	 * @param pair A tuple to be referenced for the insert.
	 * @return An iterator to the newly inserted element.
	 */
	public insert(pair: IPair<Key, T>): MapIterator<Key, T, false, Source>;

	/**
	 * Insert an element with hint.
	 * 
	 * @param hint Hint for the position where the element can be inserted.
	 * @param pair A tuple to be referenced for the insert.
	 * @return An iterator to the newly inserted element.
	 */
	public insert(hint: MapIterator<Key, T, false, Source>, pair: IPair<Key, T>): MapIterator<Key, T, false, Source>;

	/**
	 * Insert range elements.
	 * 
	 * @param first Input iterator of the first position.
	 * @param last Input iteartor of the last position.
	 */
	public insert<InputIterator extends Readonly<IForwardIterator<IPair<Key, T>, InputIterator>>>
		(first: InputIterator, last: InputIterator): void

	public insert(...args: any[]): any
	{
		return (super.insert as Function)(...args);
	}

	/* ---------------------------------------------------------
		ERASE
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected abstract _Key_eq(x: Key, y: Key): boolean;

	/**
	 * @hidden
	 */
	protected _Erase_by_key(key: Key): number
	{
		let first = this.find(key);
		if (first.equals(this.end()) === true)
			return 0;

		let last = first.next();
		let ret: number = 1;

		while (!last.equals(this.end()) && this._Key_eq(key, last.first))
		{
			last = last.next();
			++ret;
		}
		this._Erase_by_range(first, last);
		return ret;
	}

	/* ---------------------------------------------------------
		UTILITY
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public merge(source: Source): void
	{
		this.insert(source.begin(), source.end());
		source.clear();
	}
}