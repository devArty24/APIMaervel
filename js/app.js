const urlReq = `http://localhost/apiMarvel/php/`
const apiKeys = `ts=1&apikey=aquiTuAPIKey&hash=aquiTuHash`;
$(document).ready(()=>{

	$.ajax({
		"async": true,
		"crossDomain":true,
		"url": "https://gateway.marvel.com:443/v1/public/comics?orderBy=title&"+apiKeys,
		"method": "GET",
		success:function(response){
			console.log(response);
			codigoHTML = ``;
			for(i=0;i<response[`data`][`results`].length;i++){
				if(response[`data`][`results`][i]["collections"].length > 0){
					volumen = response[`data`][`results`][i]["collections"][0]["name"];
				}else{ volumen = "N/A"; }
				codigoHTML += `
					<div class="col-3 col-sm-4 col-md-4 text-center">
						<div class="row">
							<div class="col-12 col-sm-12 col-md-12" style="padding-bottom:2%;">
								<img src="${response[`data`][`results`][i]["thumbnail"]["path"]}.${response[`data`][`results`][i]["thumbnail"]["extension"]}" comic="${response[`data`][`results`][i]["id"]}" onclick="showMoreInfo(this)" style="width:50%;cursor:pointer;">
								<br>
								<span style="font-size:11px;font-weight: 400;">Nombre: ${response[`data`][`results`][i]["series"]["name"]}</span><br>
								<span style="font-size:11px;font-weight: 500;">Vol: ${volumen}</span><br>

								<label style="margin-right:3%;font-weight:700;">SI</label><input type="checkbox" name="dispoHere[]" value="${response[`data`][`results`][i]["id"]}">
							</div>
						</div>
					</div>
				`;
			}

			$(`#comicEleccion`).html(codigoHTML);
		},error:function(error){ console.log(error); }
	});

	home();

	$(`#frmNewSucursal`).submit(function(){
		console.log($(this).serialize());
		formData = new FormData(this);
		formData.append("type","saveSucursal");
		$.ajax({
			type:"post",
			url: urlReq+"conector.php",
			data:formData,
			contentType:false,cache:false,processData:false,
			beforeSend:function(){},
			success:function(response){
				console.log(response);
				if(response == `save`){
					showSucursal();
				}else{

				}

			},error:function(error){ console.log(error); }
		});
		return false;
	});

	$(`#frmUpdate`).submit(function(){
		console.log($(this).serialize());
		formData = new FormData(this);
		formData.append("type","updateSucursal");
		$.ajax({
			type:"post",
			url: urlReq+"conector.php",
			data:formData,
			contentType:false,cache:false,processData:false,
			beforeSend:function(){ $(`#btnACtualizar`).prop(`disabled`,true); },
			success:function(response){
				console.log(response);
				$(`#btnACtualizar`).prop(`disabled`,false);
				if(response == `update`){
					showSucursal();
					$(`#updateClose`).click();
					$(`#frmUpdate`)[0].reset();
				}else{

				}

			},error:function(error){ console.log(error); }
		});
		return false;
	});

});

function showSucursal(){
	$.ajax({
		dataType:"json",
		type:"post",
		url: urlReq+"conector.php",
		data:{type:"showSucursales"},
		beforeSend:function(){},
		success:function(response){
			console.log(response);

			codigoHtml = ``;
			for(i=0;i<response.length;i++){
				console.log(response[i]);
				codigoHtml += `<tr>
								<td>${response[i][1]}</td>
								<td>${response[i][2]}</td>
								<td>${response[i][3]}</td>
								<td><i class="fas fa-pen icons-custom" inin="${response[i][0]}" sucursal="${response[i][1]}" dir="${response[i][2]}" onclick="update(this)" title="Editar Sucursal"></i>
									<i class="fas fa-trash-alt icons-custom" sucursal="${response[i][0]}" name="${response[i][1]}" onclick="deleted(this)" title="Desactivar Sucursal"></i></td>
							</tr>`;
			}

			$(`#contenTableSucursal`).html(codigoHtml);
			$("#sucDispo").DataTable({ language:{"decimal": "","emptyTable": "No hay registros","info": "Mostrando de _START_ a _END_ de _TOTAL_ Registros","infoEmpty": "Mostrando 0 to 0 of 0 Registros",
                                                            "infoFiltered": "(Filtrado de _MAX_ total Registros)","infoPostFix": "","thousands": ",","lengthMenu": "Mostrar _MENU_ Registros","loadingRecords": "Cargando...",
                                                            "processing": "Procesando...","search": "Buscar:","zeroRecords": "Sin resultados encontrados","paginate": {"first": "Primero","last": "Ultimo","next": "Siguiente","previous": "Anterior"} },
                                                retrieve: true,
                                                ordering: false,
                                                responsive: true,
            });
			$(`#home`).addClass(`hidden-element`);
			$(`#frmNewSucursal`).addClass(`hidden-element`);
			$(`#sucursalCrud`).removeClass(`hidden-element`);
			$(`#tablaDiv`).removeClass(`hidden-element`);
		},error:function(error){ console.log(error); }

	});
}

function update(objetc){
	sucursal = $(objetc).attr(`sucursal`);
	direccion = $(objetc).attr(`dir`);
	id = $(objetc).attr(`inin`);

	$(`#sucursal`).val(sucursal);
	$(`#upDireccion`).val(direccion);
	$(`#cont`).val(id);

	$(`#btnUpdate`).click();
}

function deleted(object){
	id = $(object).attr(`sucursal`);
	sucursal = $(object).attr(`name`);
	alert(`Confirma que quieres borrar la sucursal: ${sucursal}`);

	$.ajax({
		type:"post",
		url: urlReq+"conector.php",
		data:{type:"deleteSucursal",idS:id},
		success:function(response){
			if(response == `deleted`){
				showSucursal();
			}
		},error:function(error){ console.log(error); }
	});
}

function home(){	
	$(`#tablaDiv`).addClass(`hidden-element`);
	$(`#frmNewSucursal`).addClass(`hidden-element`);
	$(`#sucursalCrud`).addClass(`hidden-element`);
	$(`#frmNewSucursal`)[0].reset();
	$(`#home`).removeClass(`hidden-element`);
	listadoComics();
}

function nuevaSucursal(){
	$(`#home`).addClass(`hidden-element`);
	$(`#tablaDiv`).addClass(`hidden-element`);
	$(`#frmNewSucursal`).removeClass(`hidden-element`);
}

function showMoreInfo(object){
	idComic = $(object).attr(`comic`);

	$.ajax({
		"async": true,
		"crossDomain":true,
		"url": `https://gateway.marvel.com:443/v1/public/comics/${idComic}?orderBy=title&${apiKeys}`,
		"method": "GET",
		success:function(response){
			console.log(response);

			volumen = (response[`data`][`results`][0]["collections"].length >0)?response[`data`][`results`][0]["collections"][0]["name"]:`No cuenta con volumen.`;
			numPaginas = (response[`data`][`results`][0][`pageCount`] >0)?response[`data`][`results`][0][`pageCount`]:`No se encontro numero de paginas`;
			descripcion = (response[`data`][`results`][0][`description`] != null)?response[`data`][`results`][0][`description`]:`Este comic no cuenta con una descripcion.`;
			onlyDate = response[`data`][`results`][0][`dates`][0][`date`].split(`T`);

			$(`#imagen`).html(`<img src="${response[`data`][`results`][0]["thumbnail"]["path"]}.${response[`data`][`results`][0]["thumbnail"]["extension"]}" comic="${response[`data`][`results`][0]["id"]}" onclick="showMoreInfo(this)" style="width:50%;height:50%;">`);
			$(`#titulo`).html(`<p><u><span class="span-modal">TITULO:</span> ${response[`data`][`results`][0][`title`]}</u></p>`);
			$(`#volumen`).html(`<p><span class="span-modal">VOLUMEN:</span> ${volumen}</p>`);
			$(`#fecha`).html(`<p><span class="span-modal">FECHA LANZAMIENTO:</span> ${onlyDate[0]}</p>`);
			$(`#paginas`).html(`<p><span class="span-modal">No. PAGINAS:</span> ${numPaginas}</p>`);
			$(`#descripcion`).html(`<p><span class="span-modal">DESCRIPCION:</span> ${descripcion}</p>`);

			/*GET sucursales*/
			$.ajax({
				dataType:"json",
				type:"post",
				url: urlReq+"conector.php",
				data:{type:"getSucursales",idComic:idComic},
				success:function(response){
					console.log(response);
					btHTML = ``;
					if(response.length>0){
						for(i=0;i<response.length;i++){
							btHTML += `<span>*<b><u>${response[i][0]}</u></b></span><br>`;
						}
						$(`#sucursalesIn`).html(`<span class="span-modal">DISPONIBLE EN: </span><br>
												${btHTML}
											`);
					}else{
						$(`#sucursalesIn`).html(`<p><u>Este comic aun no esta asignado a una sucursal.</u></p>`);
					}
				},error:function(error){ console.log(error); }
		
			});


			if(response[`data`][`results`][0][`characters`][`items`].length > 0){
				characters = `<div class="col-12 col-sm-12 col-md-12"><h4>Personajes:</h4></div>`;
				for(i=0;i<response[`data`][`results`][0][`characters`][`items`].length;i++){
					idCharacter =  response[`data`][`results`][0][`characters`][`items`][i][`resourceURI`].split(`/`);
	
					console.log(idCharacter);
					$.ajax({
						"async": true,
						"crossDomain":true,
						"url": `https://gateway.marvel.com:443/v1/public/characters/${idCharacter[6]}?${apiKeys}`,
						"method": "GET",
						success:function(response){
							console.log(response);
							characters += `<div class="col-6 col-sm-3 col-md-3">
												<span class="span-modal">${response[`data`][`results`][0][`name`]}</span>
												<img src="${response[`data`][`results`][0][`thumbnail`][`path`]}.${response[`data`][`results`][0][`thumbnail`][`extension`]}" style="width:100%;height:80%;">
											</div>`;
							$(`#personajes`).html(characters);
						},error:function(error){ console.log(error); }
					});
				}
			}else{
				$(`#personajes`).html(`<div class="col-12 col-sm-12 col-md-12 text-center"> <p><b>Lo sentimos!!</b> No estan disponibles los personajes</p></div>`);
			}

			$(`#btnModal`).click();
		},error:function(error){ console.log(error); }
	});
}

function listadoComics(){
	$.ajax({
		"async": true,
		"crossDomain":true,
		"url": "https://gateway.marvel.com:443/v1/public/comics?orderBy=title&"+apiKeys,
		"method": "GET",
		success:function(response){
			console.log(response);
			codigoHTML = ``;
			for(i=0;i<response[`data`][`results`].length;i++){
				if(response[`data`][`results`][i]["collections"].length > 0){
					volumen = response[`data`][`results`][i]["collections"][0]["name"];
				}else{ volumen = "N/A"; }
				codigoHTML += `
					<div class="col-3 col-sm-3 col-md-3 text-center">
						<div class="row">
							<div class="col-12 col-sm-12 col-md-12" style="padding-bottom:10%;">
								<img src="${response[`data`][`results`][i]["thumbnail"]["path"]}.${response[`data`][`results`][i]["thumbnail"]["extension"]}" comic="${response[`data`][`results`][i]["id"]}" onclick="showMoreInfo(this)" style="width:50%;cursor:pointer;">
								<br>
								<span style="font-size:11px;font-weight: 400;">Nombre: ${response[`data`][`results`][i]["series"]["name"]}</span><br>
							</div>
						</div>
					</div>
				`;
			}

			$(`#listadoComics`).html(codigoHTML);
		},error:function(error){ console.log(error); }
	});
}