import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import Swal from 'sweetalert2'

export interface DataKinematic {
  id?: number // ID único generado por Supabase
  group_id: string
  servo_id: number
  direction: string
  min_value: number
  max_value: number
}

export const useKinematicStore = defineStore('kinematic', {
  state: () => ({
    createKinematic: {
      id: undefined,
      group_id: '',
      servo_id: 0,
      direction: '',
      min_value: 0,
      max_value: 1023,
    } as DataKinematic,
    groupData: [] as DataKinematic[], // Datos en memoria (pueden ser locales o de Supabase)
  }),
  actions: {
    // Buscar datos por Group ID en Supabase
    async fetchByGroupId() {
      if (!this.createKinematic.group_id) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo vacío',
          text: 'Por favor, ingresa un Group ID válido.',
        })
        return
      }

      try {
        const { data, error } = await supabase
          .from('kinematic_groups')
          .select('*')
          .eq('group_id', this.createKinematic.group_id)
          .order('id')

        if (error) {
          console.error('Error al buscar en Supabase:', error.message)
          Swal.fire({
            icon: 'error',
            title: 'Error en Supabase',
            text: `Hubo un error al buscar en Supabase: ${error.message}`,
          })
        } else {
          this.groupData = data || []
          if (this.groupData.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron datos para este Group ID.',
            })
          }
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error inesperado.',
        })
      }
    },

    // Guardar datos en Supabase
    async saveToSupabase() {
      if (
        !this.createKinematic.group_id ||
        !this.createKinematic.servo_id ||
        !this.createKinematic.direction ||
        this.createKinematic.min_value === null ||
        this.createKinematic.max_value === null
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completa todos los campos.',
        })
        return
      }

      try {
        const { error } = await supabase.from('kinematic_groups').insert([
          {
            group_id: this.createKinematic.group_id,
            servo_id: this.createKinematic.servo_id,
            direction: this.createKinematic.direction,
            min_value: this.createKinematic.min_value,
            max_value: this.createKinematic.max_value,
          },
        ])

        if (error) {
          console.error('Error al guardar en Supabase:', error.message)
          Swal.fire({
            icon: 'error',
            title: 'Error en Supabase',
            text: `Hubo un error al guardar en Supabase: ${error.message}`,
          })
        } else {
          console.log('Guardado con éxito en Supabase.')
          Swal.fire({
            icon: 'success',
            title: 'Datos guardados',
            text: 'Los datos se han guardado correctamente.',
          })
          this.resetKinematic()
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error inesperado.',
        })
      }
    },

    // Actualizar datos en Supabase
    async updateInSupabase() {
      if (!this.createKinematic.id) {
        Swal.fire({
          icon: 'warning',
          title: 'Registro no seleccionado',
          text: 'Por favor, selecciona un registro para editar.',
        })
        return
      }

      try {
        const { error } = await supabase
          .from('kinematic_groups')
          .update({
            group_id: this.createKinematic.group_id,
            servo_id: this.createKinematic.servo_id,
            direction: this.createKinematic.direction,
            min_value: this.createKinematic.min_value,
            max_value: this.createKinematic.max_value,
          })
          .eq('id', this.createKinematic.id)

        if (error) {
          console.error('Error al actualizar en Supabase:', error.message)
          Swal.fire({
            icon: 'error',
            title: 'Error en Supabase',
            text: `Hubo un error al actualizar en Supabase: ${error.message}`,
          })
        } else {
          console.log('Actualizado con éxito en Supabase.')
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados',
            text: 'Los datos se han actualizado correctamente.',
          })
          this.resetKinematic()
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error inesperado.',
        })
      }
    },

    // Eliminar un registro en Supabase
    async deleteItem(id: number) {
      if (!id) {
        Swal.fire({
          icon: 'warning',
          title: 'Registro no seleccionado',
          text: 'Por favor, selecciona un registro para eliminar.',
        })
        return
      }

      try {
        const { error } = await supabase.from('kinematic_groups').delete().eq('id', id)

        if (error) {
          console.error('Error al eliminar en Supabase:', error.message)
          Swal.fire({
            icon: 'error',
            title: 'Error en Supabase',
            text: `Hubo un error al eliminar en Supabase: ${error.message}`,
          })
        } else {
          console.log('Eliminado con éxito en Supabase.')
          Swal.fire({
            icon: 'success',
            title: 'Registro eliminado',
            text: 'El registro se ha eliminado correctamente.',
          })
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error inesperado.',
        })
      }
    },

    // Editar un elemento en memoria
    editItem(item: DataKinematic) {
      this.createKinematic = { ...item }
    },

    // Resetear el formulario
    resetKinematic() {
      this.createKinematic = {
        id: undefined,
        servo_id: 0,
        direction: '',
        min_value: 0,
        max_value: 1023,
        group_id: this.createKinematic.group_id,
      }
    },
  },
})
