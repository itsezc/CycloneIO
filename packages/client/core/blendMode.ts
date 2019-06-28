
export const generateBlendMode = (renderer: any, firstMode?: GLenum, secondMode?: GLenum, equation?: GLenum ): number => {
    const { gl } = renderer 

    const _firstMode = firstMode || gl.ZERO
    const _secondMode = secondMode || gl.DST_COLOR
    const _equation = equation || gl.ONE_MINUS_CONSTANT_ALPHA

    return renderer.addBlendMode([_firstMode, _secondMode], _equation)
}