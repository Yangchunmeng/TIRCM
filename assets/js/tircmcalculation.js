function tircmcalculation(a,b,c,d,e){

	//Variables
	var OLI_Temp = a.value;
	var OLI_Tempdis = document.getElementById("oli_temp");
	OLI_Tempdis.innerHTML = OLI_Temp;
	
	var OLI_Temptime = document.getElementById("oli_time");
	OLI_Temptime.innerHTML = dateFormat(a.created_at, "HH:MM:ss, dd/mm/yy");//use date-time-format.js

	var OTI_Temp = b.value;
	var OTI_Tempdis = document.getElementById("oti_temp");
	OTI_Tempdis.innerHTML = OTI_Temp;

	var OTI_Temptime = document.getElementById("oti_time");
	OTI_Temptime.innerHTML = dateFormat(b.created_at, "HH:MM:ss, dd/mm/yy");//use date-time-format.js
	
	var WTI_Temp = c.value;
	var WTI_Tempdis = document.getElementById("wti_temp");
	WTI_Tempdis.innerHTML = WTI_Temp;
	
	var WTI_Temptime = document.getElementById("wti_time");
	WTI_Temptime.innerHTML = dateFormat(c.created_at, "HH:MM:ss, dd/mm/yy");//use date-time-format.js

	var Oil_Difference = OLI_Temp - OTI_Temp;
	var Oil_Differencedis = document.getElementById("oil_difference");
	Oil_Differencedis.innerHTML = Oil_Difference.toFixed(2) + " °C";

	var OLI_Tempb = d.value;
	var OTI_Tempb = e.value; //changed when needed
	var Oil_Differenceb = OLI_Tempb - OTI_Tempb;

	var WO_Difference = WTI_Temp - OTI_Temp;
	var CR_OT = ((OTI_Temp - OTI_Tempb) / OTI_Tempb) * 100;
	var CR_OL = ((OLI_Temp - OLI_Tempb) / OLI_Tempb) * 100;
	var CROil_Difference = (Oil_Difference - Oil_Differenceb) / Oil_Differenceb;

	var G = 40000; //Weight of liquid in the transformer
	var a = 0.88; //Density of transformer liquid by a temperature of 20°C: for oil = 0.88
	var b = 0.78 / 1000; //Coefficient of expansion of transformer liquid: for oil = 0.78∙10^(−3)
	var V = G / a * b * Oil_Difference * -1;
	var Vdis = document.getElementById("V");
	Vdis.innerHTML = V.toFixed(2) + " L";
	var oildrum = Math.ceil(Math.abs(V / 200)); //e.g. ensure 2.83 or -1.24 will be 3 and 2
	var oildrumdis = document.getElementById("oildrum");
	oildrumdis.innerHTML = "Please bring " + oildrum.toFixed(0) + " oil drum(s) to site.";

	//display name
	var dis11;
	var dis12;
	var dis2WT;
	var dis2OT;
	var dis2OL;
	var dis31;
	var dis32;

	//Function 1 Health Monitoring
	//1. Oil Level Indicator Health Monitoring
	function f11() {
		if ((CR_OL == 0) && (Math.abs(CR_OT) > 0)) {
			return{ 
				"innerHTML":"Failure.Blocking", 
				"className":"text-danger"
			};
		} else {
			return{
				"innerHTML":"Healthy",
				"className":"text-success"
			};
		}
	}
	document.getElementById("f11").innerHTML = f11().innerHTML;
	document.getElementById("f11").className += f11().className;

	//2. Winding Temperature/Oil Temperature Indicator Health Monitoring
	function f12() {
		if ((WO_Difference > 30) || (WO_Difference < 0)) {
			return{
				"innerHTML":"Either/Both Failure",
				"className":"text-danger"
			};
		} else {
			return{
				"innerHTML":"Healthy",
				"className":"text-success"
			};
		}
	}

	document.getElementById("f12").innerHTML = f12().innerHTML;
	document.getElementById("f12").className += f12().className;
	document.getElementById("f13").innerHTML = f12().innerHTML;
	document.getElementById("f13").className += f12().className;

	//Function 2 Alarm Monitoring
	//Winding Temperature
	function f21() {
		if (WTI_Temp >= 130) {
			return{
				"innerHTML":"Transformer Trip",
				"className":"text-danger"
			};
		} else if ((WTI_Temp >= 110) && (WTI_Temp < 130)) {
			return{
				"innerHTML":"Transformer Alarm",
				"className":"text-warning"
			};
		} else if (WTI_Temp < 0) {
			return{
				"innerHTML":"Error",
				"className":"text-warning"
			};
		} else if ((WTI_Temp >= 0) && (WTI_Temp < 110)) {
			return{
				"innerHTML":"Normal",
				"className":"text-success"
			};
		}
	}
	document.getElementById("f21").innerHTML = f21().innerHTML;
	document.getElementById("f21").className += f21().className;

	//Oil Temperature
	function f22() {
		if (OTI_Temp >= 105) {
			return{
				"innerHTML":"Transformer Trip",
				"className":"text-danger"
			};
		} else if ((OTI_Temp >= 85) && (OTI_Temp < 105)) {
			return{
				"innerHTML":"Transformer Alarm",
				"className":"text-warning"
			};
		} else if (OTI_Temp < 0) {
			return{
				"innerHTML":"Error",
				"className":"text-warning"
			};
		} else if ((OTI_Temp >= 0) && (OTI_Temp < 85)) {
			return{
				"innerHTML":"Normal",
				"className":"text-success"
			};
		}
	}
	
	document.getElementById("f22").innerHTML = f22().innerHTML;
	document.getElementById("f22").className += f22().className;

	//Oil Level
	function f23() {
		if (OLI_Temp >= 120) {
			return{
				"innerHTML":"High Oil Level Alarm",
				"className":"text-danger"
			};
		} else if (OLI_Temp <= 0) {
			return{
				"innerHTML":"Low Oil Level Alarm",
				"className":"text-danger"
			};
		} else {
			return{
				"innerHTML":"Normal",
				"className":"text-success"
			};
		}
	}

	document.getElementById("f23").innerHTML = f23().innerHTML;
	document.getElementById("f23").className += f23().className;

	//Function 3 Decision Making
	//Oil Level Adjustment Judgement
	function f31() {
		if (Oil_Difference >= 20) //V20=-709.09
		{
			return{
				"innerHTML":"Extract Stage 2.Emergency.",
				"className":"text-danger"
			};
		} else if ((Oil_Difference < 20) && (Oil_Difference >= 15)) //V15=-531.82
		{
			return{
				"innerHTML":"Extract Stage 1.Inspection.",
				"className":"text-warning"
			};
		} else if ((Oil_Difference < 1) && (Oil_Difference >= -10)) //V1=35.45
		{
			return{
				"innerHTML":"Refill Stage 1.Inspection.",
				"className":"text-warning"
			};
		} else if (Oil_Difference < -10) //V10=354.55
		{
			return{
				"innerHTML":"Refill Stage 2.Emergency.",
				"className":"text-danger"
			};
		} else if ((Oil_Difference < 15) && (Oil_Difference >= 1)) //between 0 and 15
		{
			return{
				"innerHTML":"Normal.",
				"className":"text-success"
			};
		}
	}

	document.getElementById("f31").innerHTML = f31().innerHTML;
	document.getElementById("f31").className += f31().className;

	//Oil Leakage/Gush Severity Judgement
	function f32() {
		if (CROil_Difference <= -0.05) { //oil leakage
			return{
				"innerHTML":"Oil Leakage Severity.Emergency.",
				"className":"text-danger"
			};
		} else if (CROil_Difference >= 0.05) { //oil gush
			return{
				"innerHTML":"Oil Gush Severity.Emergency.",
				"className":"text-danger"
			};
		} else if ((CROil_Difference < 0.05) && (CROil_Difference > -0.05)) {
			return{
				"innerHTML":"Normal.",
				"className":"text-success"
			};
		}
	}

	document.getElementById("f32").innerHTML = f32().innerHTML;
	document.getElementById("f32").className += f32().className;
}
