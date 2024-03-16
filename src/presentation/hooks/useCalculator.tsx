import { useEffect, useRef, useState } from "react"


enum Operator {
    add = '+',
    subtract = '-',
    multiply = '*',
    divide = '/'
}

export const useCalculator = () => {
    const [number, setNumber] = useState('0')
    const [prevNumber, setPrevNumber] = useState('0')
    const lastOperation = useRef<Operator>();

    const [formula, setFormula] = useState('')


    useEffect(() => {
        if (lastOperation.current) {
            const firstFormulaPart = formula.split(' ').at(0);
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`)
        } else {
            setFormula(number);
        }
    }, [number])


    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`${subResult}`)
    }, [formula])


    const clean = () => {
        setNumber('0');
        setPrevNumber('0');
        lastOperation.current = undefined;
        setFormula('');
    }


    // Borrar ultimo valor
    const deleteOperation = () => {
        if (number.length === 1) return setNumber('0');
        if (number.length === 2 && number[0] === '-') return setNumber('0');

        return setNumber(number.slice(0, number.length - 1));
    }


    const toggleSign = () => {
        if (number.includes('-')) {
            return setNumber(number.replace('-', ''));
        }

        setNumber('-' + number);
    }


    const buildNumber = (numberString: string) => {
        if (number.includes('.') && numberString === '.') return;

        if (number.startsWith('0') || number.startsWith('-0')) {
            // para colocar un solo punto decimal en la operacion
            if (numberString === '.') {
                return setNumber(number + numberString)
            }

            //evaluar si es cero y no hay punto
            if (numberString === '0' && number.includes('.')) {
                return setNumber(number + numberString)
            }

            //evaluar si es diferente de cero y no hay punto decimal y es el primer caracter
            if (numberString !== '0' && !number.includes('.')) {
                return setNumber(numberString)
            }

            //evitar que se coloque varios 0000000.00
            if (numberString === '0' && !number.includes('.')) {
                return;
            }

            return setNumber(number + numberString);
        }

        setNumber(number + numberString);

    }

    const setLastNumber = () => {
        calculateResult();

        if (number.endsWith('.')) {
            setPrevNumber(number.slice(0, -1));
        } else {
            setPrevNumber(number);
        }
        setNumber('0');

    }

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    }

    const subtractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.subtract;
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    }

    const calculateResult = () => {
        const resultado = calculateSubResult();
        setFormula(`${resultado}`);

        lastOperation.current = undefined;
        setPrevNumber('0');
    }




    const calculateSubResult = (): number => {
        const [fisrtValue, operation, secondValue] = formula.split(' ');

        console.log('*************')
        console.log(fisrtValue)
        console.log(secondValue)
        console.log('*************')
        const num1 = Number(fisrtValue); // NaN
        const num2 = Number(secondValue); // NaN

        if (isNaN(num2) || num2 == undefined) return num1;

        switch (operation) {
            case Operator.add:
                return num1 + num2;

            case Operator.subtract:
                return num1 - num2;

            case Operator.multiply:
                return num1 * num2;

            case Operator.divide:
                return num1 / num2;

            default:
                throw new Error('Operation not implemented;')
        }
    }
    return {
        //Propiedades
        number,
        prevNumber,
        formula,

        //Metodos
        buildNumber,
        toggleSign,
        clean,
        deleteOperation,
        divideOperation,
        multiplyOperation,
        subtractOperation,
        addOperation,
        calculateResult
    }
}