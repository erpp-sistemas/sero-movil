import { Component, OnInit } from '@angular/core';


import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { RestService } from '../services/rest.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-chart-coordinator',
  templateUrl: './chart-coordinator.page.html',
  styleUrls: ['./chart-coordinator.page.scss'],
})
export class ChartCoordinatorPage implements OnInit {

  showChart: boolean = false;

  // Tipo de gráfico de barras horizontal
  public barChartType: ChartType = 'bar';

  // Datos para el gráfico
  public barChartData: ChartData<'bar'> = {
    labels: [], // Aquí se mostrarán los nombres de los usuarios
    datasets: [
      {
        data: [], // Aquí se mostrarán los números de gestiones por usuario
        label: 'Gestiones por Usuario',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Opciones del gráfico
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Desactiva la relación de aspecto
    indexAxis: 'y', // Gráfica horizontal
    scales: {
      x: {
        grid: {
          display: false, // Quitar el grid del eje X
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false // Quitar el grid del eje Y
        },
        ticks: {
          autoSkip: false, // Para mostrar todos los nombres de los usuarios
          color: '#FFFFFF'
        }
      },
    }
  };


  constructor(
    private rest: RestService,
    private storage: Storage
  ) { }

  
  ngOnInit() {
    this.loadData();
  }


  async loadData() {
    const id_plaza = await this.storage.get('IdPlazaActiva')
    const data = await this.rest.getGestionesByGestor(id_plaza);

    const gestores = data.map(gestor => gestor.nombre_gestor);
    const totales = data.map(gestor => gestor.total_extrajudicial)

    this.buildChart(gestores, totales)
  }

  buildChart(gestores: any, totales: any) {
    this.barChartData.labels = gestores;
    this.barChartData.datasets[0].data = totales;
    this.showChart = true;
  }



}
