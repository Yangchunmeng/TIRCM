(function(){
    var afio;
    $("#disconnect_aio").click(function(){
        afio.msaio_disconnect();
        $("#connect_aio").attr("disabled",false);
        $("#disconnect_aio").attr("disabled",true);
    })
        $("#connect_aio").click(function(){
            afio = new msAdafruitIO($("#AIO_username").val(),$("#AIO_key").val());
            afio.msaio_connect({onConnect:onConnect,onMessageArrived:onMessageArrived});
            afio.get_user_info(function(data)
            {
                if(data != null)
                    {
                        $("#connect_aio").attr("disabled",true);
                        $("#disconnect_aio").attr("disabled",false);
                        $("#aio_user_id").val(data['id']);
                        $("#aio_username").val(data['username']);
                        $("#aio_name").val(data['name']);
                        $("#aio_created_at").val(data['created_at']);

                        afio.get_feed(null,function(data){
                            if(data != null)
                            {
                                data.forEach(element => {
                                    $("#select_feed").append("<option value="+element.key+">"+element.key+"</option>")
                                });
                                afio.monitor_feed($("#select_feed").find("option:nth-child(1)").val())
                            }
                        });
                        
                    }
                    else{
                        alert("Authorization Failed");
                    }
            });
        })

        $("#select_feed").on('change',function(){
            afio.stop_monitor_feed();
            var op_sel = $(this).find("option:selected").val()
            afio.monitor_feed(op_sel);
            $("#feed_table tbody").html("<tr><th id=\"feed_rem\" colspan=\"3\">Your Data Will appear here</th></tr>")
            $("#feed_rem").show();
        });

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            alert("Connected");
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {
            var feed = message.destinationName.split("/")[2];
            var value = message.payloadString;
            $("#feed_table tbody tr:first").before("<tr><th scope=row>"+feed+"</th><th>"+value+"</th><th>"+Date()+"</th></tr>");
            if($("#feed_rem").length > 0)
                $("#feed_rem").hide();
        }


})();