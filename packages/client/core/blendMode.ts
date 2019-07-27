
export const generateBlendMode = (renderer: any, firstMode?: GLenum, secondMode?: GLenum, equation?: GLenum ): number => {
    const { gl } = renderer

    //gl.DST_COLOR
    const _firstMode = firstMode || gl.ONE
    //gl.ONE_MINUS_CONSTANT_ALPHA
    const _secondMode = secondMode || gl.ONE
    const _equation = equation || gl.FUNC_ADD

    return renderer.addBlendMode([_firstMode, _secondMode], _equation)
}