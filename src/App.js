import React, { useRef, useState, useEffect } from 'react'
import './App.css'

export default  props => {
	const canvasRef = useRef(null)
	const [canvas, setCanvas] = useState(null)
	const [dt, setDt] = useState(0)
	const [inProgress, setInProgress] = useState(false)

	const CHECK_PRESCION = 255 //точность самого Мальденброта
	const INFINITY_EDGE = 10 // бесконечность, мнимая грань
	const CHECK_VALUES = 4// площа охвата

	const canvasWidth = 500
	const canvasHeigth = 500

	useEffect(() => setCanvas(canvasRef.current), [])

	const drawPixel = (data, x, y, color) => {	
		const index = 4 * (canvas.width * Math.round(y) + Math.round(x))
		data[index + 0] = color.r
		data[index + 1] = color.g
		data[index + 2] = color.b
		data[index + 3] = color.a
	}

	const draw = () => {
		setInProgress(true)
		const context = canvas.getContext('2d')
		const image = context.createImageData(canvas.width, canvas.height)
		const data = image.data
		const startTime = new Date()
		//do stuff


		for (let j = -CHECK_VALUES/2; j < CHECK_VALUES/2; j+=CHECK_VALUES/canvasWidth){
            for (let k = -CHECK_VALUES/2; k < CHECK_VALUES/2; k+=CHECK_VALUES/canvasHeigth){
                const color = checkComplex(new Complex(j,k))
				drawPixel(data, j * canvasWidth/CHECK_VALUES + canvasWidth/2, k * canvasWidth/CHECK_VALUES + canvasHeigth/2, color)
            }
        }


		//done!
		setDt(new Date() - startTime)
		context.putImageData(image, 0, 0)
		setInProgress(false)
	}

	const checkComplex = c => {
		let old_c = c
		let new_c = new Complex(0, 0)
		let i = 0
		for (i = 0; i < CHECK_PRESCION; i+=1){
			new_c = Complex.add(Complex.mult(new_c, new_c), old_c) 
	
			if (Math.abs(new_c.im) > INFINITY_EDGE) return  {r:i*i/2,g:i*4,b:255-i,a: Math.max(200 - i, 0)}
		}
	
		return {r:0,g:0,b:0,a:255}
	} 

	return <div className='mainContainer'>
		<canvas width={canvasWidth} height={canvasHeigth} ref={canvasRef} {...props} />
		<span >duration:{dt/1000} sec</span>
		<button disabled={inProgress} onClick={draw}>Draw</button>
	</div>
}

class Complex {
    #x = 0
    #y = 0
    constructor(x,y){
         this.#x = x
         this.#y = y
    }
    toString(){
        return `${this.#x}${this.#y>0?` + ${Math.abs(this.#y)}i`:this.#y<0?` - ${Math.abs(this.#y)}i`:''}`
    }
    get re(){return this.#x}
    get im(){return this.#y}
    get magnitude(){return (this.#x**2 + this.#y**2)**0.5}
    static add(c1,c2){return new Complex(c1.#x + c2.#x,c1.#y + c2.#y)}
    static sub(c1,c2){return new Complex(c1.#x - c2.#x,c1.#y - c2.#y)}
    static mult(c1,c2){return new Complex(c1.#x * c2.#x - c1.#y * c2.#y,c1.#x * c2.#y + c1.#y * c2.#x)}
    static div(c1,c2){
        let squares = c1.#x**2 - c2.#y**2
        return new Complex(Complex.re(c1)/squares,-Complex.im(c1)/squares)
    }
}



const rgb2hex = rgb => ((rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
