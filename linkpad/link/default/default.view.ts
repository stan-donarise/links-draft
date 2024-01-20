namespace $.$$ {
	
	export class $ss_linkpad_link_default extends $.$ss_linkpad_link_default {

		type_data(): $ss_linkpad_link_data {
			return this.Link_data( this.data().type_id() )
		}
		type_name(): string {
			return this.type_data()?.name()
		}

		type_name_before(): string {
			return `"${this.type_name()?.replaceAll('\n',' ')}"`
		}

		from_view(): readonly any[] {
			return []
		}

		self_view(): readonly any[] {
			return this.type_name() == 'Contain' && this.hide_contain() ? [ ] : [ this.Self() ]
		}

		to_link_gap(): readonly any[] {
			return this.type_name() == 'Contain' && this.hide_contain() ? [ ] : [ this.To_link_gap() ]
		}

		self_sub(): readonly any[] {
			return this.to_link() ? this.self_link() : this.self_node() 
		}

		connected_link(pos: number) {
			return this.links()[pos]
		}

		links_with_slots(): readonly any[] {
			const links_with_slots: $mol_view[] = []
			this.links().forEach( ( link, i ) => {
				links_with_slots.push( this.Connected_link(i) )
			} )
			const last_slot = this.Slot( this.links().length )
			links_with_slots.push( last_slot )
			return this.type_name() == 'Contain' && this.hide_contain() ? [ ] : links_with_slots
		}
		
		has_links(): boolean {
			return this.links().length > 0 ? true : false
		}
		is_node(): boolean {
			return this.to_link() ? false : true
		}

		to_link_view(): readonly any[] {
			return this.to_link() ? [
				this.To_link() 
			] : this.data().from_id() ? [ 
				this.Slot_to_link() 
			] : []
		}
		
		Name_block() {
			const block_id: $ss_linkpad_link_block_id = [ this.ui_id(), 'name' ]
			const block = this.Block( block_id )
			block.value_changed = next => this.data().name( next )
			block.update_value( this.data().name() )
			return block
		}

		auto() {
			this.hide_last_line()
		}
		@ $mol_mem_key
		slot_focused_or_hovered( i: number, next?: any ): boolean {
			if (i == this.links().length) {
				this.hide_last_line( !next )
			}
			return next
		}
		Slot_block( i: number ) {
			const block_id: $ss_linkpad_link_block_id = [ this.ui_id(), `slot${i}` ]
			const block = this.Block( block_id )
			block.value_changed = ( next )=> {
				return this.slot_value( i, next )
			}
			block.update_value( this.slot_value( i ) )
			block.before_any_input = (e: InputEvent)=> {
				const link = this.add_new_link( {from: this.ui_id(), pos:i, val:e.data } )
				link.Type_name_block().focus()
				e.preventDefault()
			}
			if (i == this.links().length) {
				block.on_focused_or_hovered = (next?: boolean) => {
					this.slot_focused_or_hovered( i, next )
				}
			}
			return block
		}

		Type_block() {
			const block_id: $ss_linkpad_link_block_id = [ this.ui_id(), 'type' ]
			const block = this.Block( block_id )
			block.update_value( this.type_name() )
			return block
		}

		color() {
			return `hsl(${this.type_data()?.hue()} 80% 60%)`
		}
		semitransporent() {
			return `hsl(${this.type_data()?.hue()} 90% 60% / 20%)`
		}

		Value_block() {
			const block_id: $ss_linkpad_link_block_id = [ this.ui_id(), 'value' ]
			const block = this.Block( block_id )
			block.value_changed = next => this.data().val( next )
			block.update_value( this.data().val() )
			return block
		}

		name() {
			return this.data().name()
		}

		has_name(): boolean {
			return Boolean( this.name() )
		}

		type_and_name(): readonly any[] {
			return this.has_name() ? super.type_and_name() : []
		}
		value_and_id(): readonly any[] {
			return (this.has_name() && this.data().val()) ? 
				[ this.Link_id(), this.Value() ] : 
				this.type_name() == 'Package' ? [ this.Value(), this.Open_block(), this.Link_id() ] :
					[ this.Value(), this.Link_id() ]
		}

		arg_path() {
			return this.$.$mol_state_arg.value( 'path' ) || null
		}
		close_panel() {
			return new this.$.$mol_state_arg( this.state_key() ).link( { right: null, path: this.arg_path() } )
		}

	}
	
}
