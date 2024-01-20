namespace $.$$ {
	
	export class $ss_linkpad_link_undef extends $.$ss_linkpad_link_undef {
		color() {
			return `hsl(${this.data().hue()} 0% 60%)`
		}
		semitransporent() {
			return `hsl(${this.data().hue()} 0% 60% / 20%)`
		}
		insert_view(): readonly any[] {
			return this.valid() ? super.insert_view() : []
		}
		type_and_name(): readonly any[] {
			return []
		}

		Name_block() {
			const block_id: $ss_linkpad_link_block_id = [ this.ui_id(), 'name' ]
			const block = this.Block( block_id )
			block.value_changed = next => this.data().name( next )
			block.update_value( this.data().name() )
			block.focused = next => this.name_focused( next )

			block.keydown_enter = () => {
				if ( this.data().name() == this.options_filtered()[0] ) {
					return true
				}
				this.event_select( this.options_filtered()[0] )
				block.focus()
				return true
			}
			return block
		}

		@ $mol_mem
		insert() {
			const sel_id = this.select_links().find( item=> {
				return item.key == this.data().name()
			} )?.id
			if ( ! sel_id ) return
			const sel_data = this.Link_data( sel_id )
			let new_ui_id = this.ui_id()
			if ( sel_data.name() ) {
				new_ui_id = this.replace( { 
					ui_id: this.ui_id(),
					new_type_id: sel_id,
				} )
			} else if (this.is_node()) {
				new_ui_id = this.replace( { 
					ui_id: this.ui_id(), 
					new_to: $ss_linkpad_link_ui_id_build( sel_id, this.ui_id()[0] )
				} )
			} else {
				new_ui_id = this.replace( { 
					ui_id: this.ui_id(),
					new_id: sel_id,
				} )
			}
			const value_block_id: $ss_linkpad_link_block_id = [ new_ui_id, 'value' ]
			const value_block = this.Block( value_block_id )
			value_block.focus()
		}
		
		@ $mol_mem
		filter_pattern() {
			return this.data().name()
		}

		@ $mol_mem
		valid(): boolean {
			return this.options_filtered().includes( this.data().name() )
		}

		@ $mol_mem
		autocomplete_showed(): boolean {
			return ! this.valid()
		}

		select_value( next?: any ): string {
			return this.data().name()
		}

		@ $mol_mem
		select_links() {
			const links: { id: string, key: string }[] = []
			this.all_link_ids().forEach( id=> {
				const data = this.Link_data( id )
				if ( ! data ) return
				if ( data.undef() ) return
				if ( ! ( data.name() || data.val() ) ) return
				const type = this.Link_data( data.type_id() )
				const key = data.name() ? data.name() : `${type.name()} ${data.val()}`
				links.push( { id, key } )
			} )
			return links
		}

		@ $mol_mem
		select_dict() {
			const dict: Record< string, string > = Object.fromEntries( 
				this.select_links().map( item=> [ item.key, item.key ] ) 
			)
			return dict
		}

		event_select( selected: string ) {
			this.data().name( selected )
		}

	}
	
}
