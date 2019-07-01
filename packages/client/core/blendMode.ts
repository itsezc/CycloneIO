
export const generateBlendMode = (renderer: any, firstMode?: GLenum, secondMode?: GLenum, equation?: GLenum ): number => {
    const { gl } = renderer 

    const _firstMode = firstMode || gl.DST_COLOR
    const _secondMode = secondMode || gl.ONE_MINUS_CONSTANT_ALPHA
    const _equation = equation || gl.ADD

    return renderer.addBlendMode([_firstMode, _secondMode], _equation)
}