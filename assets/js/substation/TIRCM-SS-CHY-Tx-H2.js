/*
  Project Name: Transformer Indicator Realtime Condition Monitoring JS File
  Author: Steven Yang (SY16401)
  Company: CLP Power (HK) Limited
  Team: PSBG/WER/MB/Plant
  Date: 20-Jan-2019
  Version: V1.01
*/

//adafruitIO calling feeds
(function () {
	//Creating new msAdafruitIO object
	var afio = new msAdafruitIO("StevenYang", "d369635d81a948668ba754d4c57b7028");
	//Calling msaio_connect before calling calling any other function
	afio.msaio_connect({
		onConnect: onConnect,
		onMessageArrived: onMessageArrived
	});
	//Getting user info to check if api is working or not OPTIONAL Step
	afio.get_user_info(function (data) {
		if (data == null) {
			alert("Authorization Failed");
		}
	});

	// called when the client connects
	function onConnect() {
		// Once a connection has been made, make a subscription and send a message.
		//alert("Connected");
		$.notify({
			// options
			message: '<i class="material-icons">notifications</i><b>Connected to Adafruit Server Successfully!</b>'
		}, {
			// settings
			placement: {
				from: "top",
				align: "right"
			},
			type: 'success'
		});
	}

	// called when the client loses its connection
	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:" + responseObject.errorMessage);
		}
	}

	// called when a message arrives
	function onMessageArrived(message) {
		var feed = message.destinationName.split("/")[2];
		var value = message.payloadString;
	}

	//called feed JSON (Attention!Callback hell starts here!)
	var olidata;
	var otidata;
	var wtidata;
	var olipdata;
	var otipdata;
	afio.get_feed_data("oli", "last", oliJSON);

	function oliJSON(data) {
		if (data != null) {
			olidata = data;
			console.log(olidata);
			if (olidata != null) {
				afio.get_feed_data("oti", "last", otiJSON);

				function otiJSON(data) {
					if (data != null) {
						otidata = data;
						console.log(otidata);
						if (otidata != null) {
							afio.get_feed_data("wti", "last", wtiJSON);

							function wtiJSON(data) {
								if (data != null) {
									wtidata = data;
									console.log(wtidata);
									if (wtidata != null) {
										afio.get_feed_data("oli", "previous", olipJSON);

										function olipJSON(data) {
											if (data != null) {
												olipdata = data;
												console.log(olipdata);
												if (olipdata != null) {
													afio.get_feed_data("oti", "previous", otipJSON);

													function otipJSON(data) {
														if (data != null) {
															otipdata = data;
															console.log(otipdata);
															if (otipdata != null) {
																tircmcalculation(olidata, otidata, wtidata, olipdata, otipdata);
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
})();