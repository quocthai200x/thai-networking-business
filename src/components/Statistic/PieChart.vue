

<template>
    <div class="q-mr-md row items-center justify-center">

        <CanvasJSChart :options="options" :styles="styleOptions" />
    </div>
</template> 


<script>
import { CanvasJS } from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';
import CanvasJSChart from '../../canvas/canvasjs-chart-3.7.7/CanvasJSVueComponent.vue';

export default {
    props: {
        loading: Boolean,
        createdByUser: Number,
        createdByCompany: Number
    },
    components: {
        CanvasJSChart
    },
    data() {
        CanvasJS.addColorSet("pieChart",
            [//colorSet Array
                "#ff7575",
                "#ffd175",

            ]);
        return {
            options: {
                theme: "light2",
                animationEnabled: true,
                colorSet: "pieChart",
                // title: {
                //     text: "Visitors By Channel"
                // },
                data: [{
                    type: "doughnut",
                    // indexLabel: "{label} {y}(#percent%)",
                    indexLabel: "{label} (#percent%)",
                    startAngle: 90,
                    yValueFormatString: "#,##0",
                    toolTipContent: "<span style='\"'color: {color};'\"'>{label}</span> {y}(#percent%)",
                    dataPoints: [
                        { label: "Tự ứng tuyển", y: this.createdByUser },
                        { label: "Được mời ứng tuyển", y: this.createdByCompany },

                    ]
                }]
            },
            styleOptions: {
                width: "70%",
                height: "360px"
            }
        }
    }
}
</script>

