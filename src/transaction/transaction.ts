export class Transaction{

  id: number;
  input: any;
  outputs: any;

  constructor(id:number, input: any, outputs: any) {
    this.id = id;
    this.input = input;
    this.outputs = outputs;
  }

  toString(){
    return `Transaction -
      id: ${this.id}
      input: ${this.input}
      outputs: ${this.outputs}`;
  }
}
