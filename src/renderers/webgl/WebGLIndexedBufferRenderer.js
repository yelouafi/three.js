function WebGLIndexedBufferRenderer( gl, extensions, info, capabilities ) {

	const isWebGL2 = capabilities.isWebGL2;

	let mode;

	function setMode( value ) {

		mode = value;

	}

	let type, bytesPerElement;

	function setIndex( value ) {

		type = value.type;
		bytesPerElement = value.bytesPerElement;

	}

	function render( start, count ) {

		gl.drawElements( mode, count, type, start * bytesPerElement );

		info.update( count, mode, 1 );

	}

	function renderInstances( start, count, primcount ) {

		if ( primcount === 0 ) return;

		let extension, methodName;

		if ( isWebGL2 ) {

			extension = gl;
			methodName = 'drawElementsInstanced';

		} else {

			extension = extensions.get( 'ANGLE_instanced_arrays' );
			methodName = 'drawElementsInstancedANGLE';

			if ( extension === null ) {

				console.error( 'THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
				return;

			}

		}

		extension[ methodName ]( mode, count, type, start * bytesPerElement, primcount );

		info.update( count, mode, primcount );

	}

	function renderMultiDrawInstanced( counts, starts, instances, length ){

		let extension = capabilities.multidraw

		if( capabilities.multidraw == null ){

			let i = 0

			while(i < length){

				this.renderInstances( starts[i], counts[i], instances[i])

				i++
			}

		}

		else {

			let methodName = 'multiDrawElementsInstancedWEBGL';

			extension[ methodName ](mode, counts, 0, type, starts, 0, instances, 0, length);

			let countsTotal = counts.reduce((e,t)=>e + t, 0)
			let instanceTotal = instances.reduce((e,t)=>e + t, 0)

			info.update( countsTotal, mode, instanceTotal );

		}

	}

	//

	this.setMode = setMode;
	this.setIndex = setIndex;
	this.render = render;
	this.renderInstances = renderInstances;
	this.renderMultiDrawInstanced = renderMultiDrawInstanced
}


export { WebGLIndexedBufferRenderer };
