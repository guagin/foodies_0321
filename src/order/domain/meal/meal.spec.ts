import { Meal, MealId, MealStatus } from "./meal"

describe('meal model construct', ()=>{
    it('should pass', ()=>{
        const mealId = new MealId("M1")
        const meal = new Meal(mealId, {
            name: 'RU_WEI',
            price: 100,
            describe: '',
            pictures: [''],
            status: MealStatus.preparing
        })
    })
})


describe('prepare', ()=>{
    it('should success', ()=>{
        const mealId = new MealId("M1")
        const meal = new Meal(mealId, {
            name: 'RU_WEI',
            price: 100,
            describe: '',
            pictures: [''],
            status: MealStatus.shelved
        })
        meal.prepare()
    })

    it('should failed for that meal is not launched', ()=>{
        const mealId = new MealId("M1")
        expect(()=>{

            const meal = new Meal(mealId, {
                name: 'RU_WEI',
                price: 100,
                describe: '',
                pictures: [''],
                status: MealStatus.launched
            })
            meal.prepare()
        }).toThrowError()
    })
})


describe('launch', ()=>{
    it('should success', ()=>{
        const mealId = new MealId("M1")
        const meal = new Meal(mealId, {
            name: 'RU_WEI',
            price: 100,
            describe: '',
            pictures: [''],
            status: MealStatus.preparing
        })
        meal.launch()
    })

    it('should failed for that meal is not preparing', ()=>{
        const mealId = new MealId("M1")
        expect(()=>{

            const meal = new Meal(mealId, {
                name: 'RU_WEI',
                price: 100,
                describe: '',
                pictures: [''],
                status: MealStatus.shelved
            })
            meal.launch()
        }).toThrowError()
    })
})

describe('shelve', ()=>{
    it('should success', ()=>{
        const mealId = new MealId("M1")
        const meal = new Meal(mealId, {
            name: 'RU_WEI',
            price: 100,
            describe: '',
            pictures: [''],
            status: MealStatus.launched
        })
        meal.shelve()
    })

    it('should failed for that meal is not launched', ()=>{
        const mealId = new MealId("M1")
        expect(()=>{

            const meal = new Meal(mealId, {
                name: 'RU_WEI',
                price: 100,
                describe: '',
                pictures: [''],
                status: MealStatus.preparing
            })
            meal.shelve()
        }).toThrowError()
    })
})

