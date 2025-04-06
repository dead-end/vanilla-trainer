/**
 * The possible states of a result.
 */
enum ResultStatus {
  'OK',
  'ERROR',
  'UNDEF',
}

/**
 * The class implements a result of a function call. A result can be either an
 * error with an error message or an ok status with an optional return value.
 *
 * The optional return value has a type, which requires generics. A function
 * call can have multiple places where a result is returned. The generic type
 * should be the same on all places. Sample code:
 *
 * const result = new Result<number>()
 *   ...
 * return result.setError('Not ok!')
 *   ...
 * return result.setOk(10)
 */
export default class Result<V> {
  private status = ResultStatus.UNDEF;
  private message?: string;
  //
  // The wrapper is used to ensure that we can check if the value is set and
  // return the value as V, even if the value is undefined.
  //
  private wrapper?: { value: V };

  /**
   * The function checks if the status OK.
   */
  public isOk() {
    if (this.status === ResultStatus.UNDEF) {
      throw new Error('Status not set!');
    }
    return this.status === ResultStatus.OK;
  }

  /**
   * The function checks if the status is ERROR
   */
  public hasError() {
    if (this.status === ResultStatus.UNDEF) {
      throw new Error('Status not set!');
    }
    return this.status === ResultStatus.ERROR;
  }

  /**
   * The function returns the error message. This reqires that the status is
   * ERROR.
   */
  public getMessage() {
    if (this.status !== ResultStatus.ERROR) {
      throw new Error('Status is not ERROR!');
    }
    if (!this.message) {
      throw new Error('Status is ERROR but no message is set!');
    }
    return this.message;
  }

  /**
   * The function returns the value. This requires that the status is OK and
   * the value is set.
   */
  public getValue() {
    if (this.status !== ResultStatus.OK) {
      throw new Error('Status is not OK!');
    }
    if (!this.wrapper) {
      throw new Error('Value not set!');
    }
    return this.wrapper.value;
  }

  /**
   * The function sets an optional result value and the status and retuns the
   * object.
   */
  public setOk(value: V) {
    this.status = ResultStatus.OK;
    this.wrapper = { value };
    return this;
  }

  /**
   * The function sets an error message and the status and returns the object.
   */
  public setError(data: string | Result<any>) {
    if (data instanceof Result) {
      if (!data.hasError()) {
        throw new Error('Result has not an error!');
      }
      this.message = data.message;
    } else {
      this.message = data;
    }

    this.status = ResultStatus.ERROR;
    return this;
  }
}
