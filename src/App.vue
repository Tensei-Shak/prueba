<template>
  <div class="d-flex justify-content-center">
    <h2>Create/Edit Group Kinematic</h2>
  </div>

  <div class="container mb-3">
    <!-- Importar archivo -->
    <div class="container mb-3">
      <label for="import-file" class="form-label">Import Data from .txt</label>
      <div class="input-group">
        <input type="file" accept=".txt" @change="handleFileUpload" class="form-control" id="import-file" />
        <button @click="importData" class="btn btn-primary">Import</button>
      </div>
    </div>

    <!-- Exportar datos -->
    <div class="container mb-3 d-flex gap-2">
      <button @click="exportDataToSupabase" class="btn btn-success">
        Export Data to Supabase
      </button>
      <button @click="exportGroupDataToTxt" class="btn btn-info">
        Export Group Data to .txt
      </button>
    </div>

    <!-- Acordeón: Formulario de Datos -->
    <div class="accordion" id="dataAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingForm">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm"
            aria-expanded="true" aria-controls="collapseForm">
            Formulario de Datos
          </button>
        </h2>
        <div id="collapseForm" class="accordion-collapse collapse show" aria-labelledby="headingForm"
          data-bs-parent="#dataAccordion">
          <div class="accordion-body">
            <!-- Group ID -->
            <div class="mb-3">
              <label for="group-id" class="form-label">Group ID</label>
              <div class="input-group">
                <input type="text" v-model="store.createKinematic.group_id" class="form-control" id="group-id"
                  placeholder="Enter Group ID" />
                <button @click="store.fetchByGroupId" class="btn btn-primary">
                  Search
                </button>
              </div>
            </div>

            <!-- Servo ID -->
            <div class="mb-3">
              <label for="servo-id" class="form-label">Servo ID</label>
              <select v-model="store.createKinematic.servo_id" class="form-select" id="servo-id">
                <option disabled selected>Choose...</option>
                <option v-for="id in numberServoIds" :key="id" :value="id">
                  {{ id }}
                </option>
              </select>
            </div>

            <!-- Direction -->
            <div class="mb-3">
              <label for="servo-direction" class="form-label">Direction</label>
              <select v-model="store.createKinematic.direction" class="form-select" id="servo-direction">
                <option disabled selected>Choose...</option>
                <option v-for="dir in directionServo" :key="dir" :value="dir">
                  {{ dir }}
                </option>
              </select>
            </div>

            <!-- Min Value -->
            <div class="mb-3">
              <label for="min-value" class="form-label">Min Value</label>
              <input type="range" v-model.number="store.createKinematic.min_value" class="form-range" id="min-value"
                min="0" :max="store.createKinematic.max_value" />
              <span>{{ store.createKinematic.min_value }}</span>
            </div>

            <!-- Max Value -->
            <div class="mb-3">
              <label for="max-value" class="form-label">Max Value</label>
              <input type="range" v-model.number="store.createKinematic.max_value" class="form-range" id="max-value"
                :min="store.createKinematic.min_value" max="1023" />
              <span>{{ store.createKinematic.max_value }}</span>
            </div>

            <!-- Botones Save/Update -->
            <div class="d-flex gap-2">
              <button @click="store.saveToSupabase" type="button" class="btn btn-success">
                Save
              </button>
              <button @click="store.updateInSupabase" type="button" class="btn btn-warning">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mostrar la tabla con los datos del grupo -->
    <div v-if="store.groupData.length > 0" class="container mt-4">
      <h4>Group Data</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Servo ID</th>
            <th>Direction</th>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in store.groupData" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.servo_id }}</td>
            <td>{{ item.direction }}</td>
            <td>{{ item.min_value }}</td>
            <td>{{ item.max_value }}</td>
            <td>
              <button @click="store.editItem(item)" class="btn btn-warning btn-sm me-2">
                Edit
              </button>
              <button @click="item.id !== undefined && store.deleteItem(item.id)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useKinematicStore } from '@/stores/kinematic.ts';
import { supabase } from '@/utils/supabase.ts';
import { ref } from 'vue';
import Swal from 'sweetalert2';

const store = useKinematicStore();
const numberServoIds = ref<number[]>([1, 2, 3, 4, 5, 6]);
const directionServo = ref<string[]>(['Normal', 'Reverse']);

// Variables para manejar el archivo
const fileContent = ref<string>('');
const uploadedFile = ref<File | null>(null);

// Manejar la carga del archivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string;
    };
    reader.readAsText(uploadedFile.value);
  }
};

const importData = () => {
  if (!fileContent.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Archivo no seleccionado',
      text: 'Por favor, selecciona un archivo válido.',
    });
    return;
  }

  try {
    const parsedData = JSON.parse(fileContent.value);
    if (!Array.isArray(parsedData)) {
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: 'El archivo no contiene datos válidos.',
      });
      return;
    }
    store.groupData = parsedData.map((item) => ({
      group_id: item.group_id,
      servo_id: item.servo_id,
      direction: item.direction,
      min_value: item.min_value,
      max_value: item.max_value,
    }));

    Swal.fire({
      icon: 'success',
      title: 'Datos importados',
      text: 'Los datos se han importado correctamente.',
    });
  } catch (error) {
    console.error('Error al importar datos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al importar',
      text: 'Ocurrió un error al importar los datos.',
    });
  }
};

const exportDataToSupabase = async () => {
  if (store.groupData.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin datos',
      text: 'No hay datos para exportar.',
    });
    return;
  }
  try {
    const { error } = await supabase.from('kinematic_groups').insert(store.groupData);

    if (error) {
      console.error('Error al exportar datos:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al exportar',
        text: `Hubo un error al exportar datos: ${error.message}`,
      });
    } else {
      console.log('Datos exportados con éxito a Supabase.');
      Swal.fire({
        icon: 'success',
        title: 'Datos exportados',
        text: 'Los datos se han exportado correctamente a Supabase.',
      });
    }
  } catch (err) {
    console.error('Error inesperado:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: 'Ocurrió un error inesperado.',
    });
  }
};

// Función para exportar datos a un archivo .txt en formato JSON
const exportGroupDataToTxt = () => {
  if (store.groupData.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin datos',
      text: 'No hay datos disponibles para exportar.',
    });
    return;
  }

  // Convertir los datos a formato JSON
  const jsonData = JSON.stringify(store.groupData, null, 4); // Indentación para legibilidad

  // Crear un Blob con los datos
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Crear un enlace para descargar el archivo
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'group_data.txt'; // Nombre del archivo
  link.click();

  // Liberar el objeto URL
  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'Datos exportados',
    text: 'Los datos se han exportado correctamente a group_data.txt.',
  });
};
</script>

<style scoped>
.card {
  max-width: 800px;
  margin: auto;
}
</style>
