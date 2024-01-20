namespace $.$$ {

	export class $ss_links extends $.$ss_links {

		opened_editor_pages(): readonly any[] {
			return this.editor_pages( this.opened_path() )
		}

		raw_gql_path( next?: any ): string {
			if ( next === undefined ) return this.$.$mol_state_arg.value( 'path' ) || ''
			return this.$.$mol_state_arg.value( 'path', next ) || ''
		}

		opened_path( ): string {
			const path = this.$.$mol_state_arg.value( 'path' )
			return path || ''
		}

	}

}
