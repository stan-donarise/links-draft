namespace $.$$ {

	export class $ss_blocks extends $.$ss_blocks {

		sel_modified = false
		constructor() {
			super()
			let selected: $ss_blocks_block | undefined
			document.onselectionchange = ( e )=> {
				let new_selected = this.block_from_sel()
				this.onselectionchange()
				if (! new_selected ){
					const sel = window.getSelection()!
					// if ( ! this.sel_modified ) {
						let count = 0
						while ( (!new_selected) && count < 5 ) {
							count++
							if (this.last_keydown_key == 'ArrowLeft') {
								sel.modify("move", "backward", "character")
							} else {
								sel.modify("move", "forward", "character")
							}
							new_selected = this.block_from_sel() 
						}
						this.sel_modified = true
					// } else {
					// 	this.sel_modified = false
					// }
				}
				const sel = window.getSelection()!

				if ( sel.isCollapsed && (sel.focusNode as HTMLElement).textContent == "\u200B" ) {
					if ( sel.focusOffset == 1 ) {
						if (this.last_keydown_key == "ArrowRight") {
							sel.modify("move", "forward", "character")
						} else if (this.last_keydown_key == "ArrowLeft") {
							sel.modify("extend", "backward", "character")
						}
					} else {
						if (this.last_keydown_key == "ArrowLeft") {
							sel.modify("move", "backward", "character")
						} else if (this.last_keydown_key == "ArrowRight") {
							sel.modify("extend", "forward", "character")
						}
					}
				}
				
				if( selected == new_selected ) return
				if( selected ) selected?.focus_state( 'blurred' )
				selected = new_selected
				selected?.focus_state( 'focused' )
			}
		}

		@ $mol_mem
		focus_history_dom_ids( next?: any ): readonly any[] {
			$mol_wire_solid()
			return next ?? []
		}

		@ $mol_mem
		block_dom_name() {
			return this.Block('0_0').dom_name()
		}

		@ $mol_mem_key
		Block( id: $ss_blocks_block_id ) {
			let obj = new this.$.$ss_blocks_block()
			const dom_id = JSON.stringify( id )
			obj.dom_id = ()=> dom_id
			obj.add_to_focus_history = ()=> {
				const ids = this.focus_history_dom_ids()
				this.focus_history_dom_ids(
					[ ...ids, dom_id ]
				)
			}
			return obj
		}

		block_from_node( node: Element ) {
			return this.Block( JSON.parse( node.id ) ) as $ss_blocks_block
		}

		block_from_sel() {
			let node = getSelection()?.anchorNode as Element | null
			while( node && node.localName !== this.block_dom_name() ) {
				node = node?.parentElement
			}
			if( node?.id ) return this.block_from_node( node )
		}

		@ $mol_mem
		input( e?: any ) {
			this.block_from_sel()?.input( e )
		}

		@ $mol_mem
		beforeinput( e?: any ) {
			this.block_from_sel()?.beforeinput( e )
		}

		last_keydown_key: string | undefined
		@ $mol_mem
		keydown( e?: KeyboardEvent ) {
			this.last_keydown_key = e?.key
			this.block_from_sel()?.keydown( e! )
		}
		
		@ $mol_mem
		dragenter(e: any) {
			this.block_from_sel()?.dragenter( e )
		}

		@ $mol_mem
		drop(e: any) {
			this.block_from_sel()?.drop( e )
		}

		@ $mol_mem
		drag(e: any) {
			this.block_from_sel()?.drag( e )
		}

		@ $mol_mem
		dragleave(e: any) {
			this.block_from_sel()?.dragleave( e )
		}

		@ $mol_mem
		paste(e: any) {
			this.block_from_sel()?.paste( e )
		}

		@ $mol_mem
		cut(e: any) {
			this.block_from_sel()?.cut( e )
		}

	}
	
}
